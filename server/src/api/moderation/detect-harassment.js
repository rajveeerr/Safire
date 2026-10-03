const express = require('express');
const router = express.Router();
const axios = require("axios")
const redis=require("redis")


let redisClient = null;

const initRedisClient = async () => {
  try {
    redisClient = redis.createClient({
        username: 'default',
        password: process.env.REDIS_PASS,
        socket: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT
        }
      });

    redisClient.on("error", (error) => {
      console.log("Redis connection error: " + error);
    });

    await redisClient.connect();
    console.log("Redis client connected successfully");
    return true;
  } catch (error) {
    console.log("Failed to initialize Redis client: " + error);
    redisClient = null;
    return false;
  }
};

initRedisClient();

// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// route: "/api/v1/moderation/detect-harassment" -> payload: { message: "", platform: ""}

// router.post('/detect-harassment', async (req, res) => {
//   try {
//     const { message, platform } = req.body;

//     if (!message || typeof message !== 'string' || message.trim() === '') {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Invalid or missing message'
//       });
//     }

//     const systemPrompt = `You are an AI harassment detection assistant. 
//     Carefully analyze the given text and provide a detailed JSON response 
//     with the following boolean keys:

//     Provide a STRICT JSON response WITHOUT any markdown or code block formatting. 

//       {
//         "isHarassment": true/false,
//         "isVulgar": true/false,
//         "isThreatening": true/false,
//         "isSexuallyExplicit": true/false,
//         "isPotentiallyOffensive": true/false,
//         "analysis": "detailed analysis text"
//       }
//     This is the platform where user has received the message: ${platform}.
//     Also do these harrassment checks based on platform and situation, like no one should ask any user about they have a
//     boyfriend or not, since linkedin is a professional platform, but this same thing might be routerropriate for instagram.
//     `  

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(`${systemPrompt}\n\nMessage to analyze: ${message}`);
//     const response = await result.response;
//     const text = await response.text();

//     let analysisResult;
//     try {
//       analysisResult = JSON.parse(text);
//     } catch (parseError) {
//       try {
//         const cleanedText = text.replace(/^```json\n/, '').replace(/\n```$/, '');
//         analysisResult = JSON.parse(cleanedText);
//       } catch (cleanParseError) {
//         analysisResult = {
//           isHarassment: /harassment detected/i.test(text),
//           isVulgar: /vulgar/i.test(text),
//           isThreatening: /threatening/i.test(text),
//           isSexuallyExplicit: /sexually explicit/i.test(text),
//           isPotentiallyOffensive: /offensive/i.test(text),
//           analysis: text
//         };
//       }
//     }
//     res.json({
//       status: 'success',
//       analysis: analysisResult
//     });
//   } catch (error) {
//     console.error('Message analysis error:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Failed to analyze message',
//       error: error.toString()
//     });
//   }
// });


const config = {
    healthCheck: {
        interval: 50000,
        timeout: 5000,
        unhealthyThreshold: 5,
        healthyThreshold: 2
    },
    circuitBreaker: {
        failureThreshold: 10,
        resetTimeout: 30000
    },
    rateLimit: {
        windowMs: 60000,
        maxRequests: 1000
    },
    loadBalancer: {
        // weighted | least-connections | fastest-response | round-robin | ab
        strategy: process.env.LB_STRATEGY || 'least-connections',
        // with "ab", every request is given one of two strategies, so both can be compared on live traffic
        abStrategies: (process.env.LB_AB_STRATEGIES || 'least-connections,round-robin')
            .split(',')
            .map(name => name.trim()),
        abSplit: Number(process.env.LB_AB_SPLIT || 0.5),
        // how many recent latencies each strategy keeps for its percentiles
        latencyWindow: 500
    }
};


const serverStates = new Map();

const servers = [
    //     "https://backend-1-safedm.onrender.com",
    //     "https://backend-2-safedm.onrender.com",
    //     "https://backend-3-safedm.onrender.com",
        // "https://backend-1-safedm-x7vc.onrender.com",
        // "https://backend-2-safedm-1rk9.onrender.com",
        // "https://backend-3-safedm-5syv.onrender.com",
        "https://safire-moderation-server.vercel.app",
        "https://safire-moderation-server-02.vercel.app",
        "https://safire-moderation-server-03.vercel.app",
        "https://safire-moderation-server-04.vercel.app",
        "https://safire-moderation-server-05.vercel.app",
].map(url => ({
    url,
    weight: 1,
    healthy: true,
    activeConnections: 0,
    lastResponse: 0,
    avgResponse: 0,
    failCount: 0,
    successCount: 0,
    totalRequests: 0,
    errorRate: 0
}));

// const limiter = rateLimit({
//   windowMs: config.rateLimit.windowMs,
//   max: config.rateLimit.maxRequests
// });

// healthy, and its breaker is closed, half open, or open long enough to be tried again
const isRoutable = (server) => {
    if (!server.healthy) return false;
    const state = getCircuitBreakerState(server.url);
    return state.status !== 'OPEN' ||
        Date.now() - state.lastError > config.circuitBreaker.resetTimeout;
};

const getWeightedServer = () => {
    const healthyServers = servers.filter(isRoutable);
    if (healthyServers.length === 0) return null;

    const totalWeight = healthyServers.reduce((sum, server) => sum + server.weight, 0);
    let random = Math.random() * totalWeight;

    return healthyServers.find(server => {
        random -= server.weight;
        return random <= 0;
    }) || healthyServers[0];
};

const getLeastConnectionsServer = () => {
    const healthyServers = servers.filter(isRoutable);
    if (healthyServers.length === 0) return null;

    return healthyServers.reduce((min, server) =>
        server.activeConnections < min.activeConnections ? server : min
    );
};

// a server not measured yet reads 0, so it gets tried and measured first
const getFastestResponseServer = () => {
    const healthyServers = servers.filter(isRoutable);
    if (healthyServers.length === 0) return null;

    return healthyServers.reduce((fastest, server) =>
        server.avgResponse < fastest.avgResponse ? server : fastest
    );
};

let roundRobinIndex = 0;

const getRoundRobinServer = () => {
    const healthyServers = servers.filter(isRoutable);
    if (healthyServers.length === 0) return null;

    return healthyServers[roundRobinIndex++ % healthyServers.length];
};

const strategies = {
    'weighted': getWeightedServer,
    'least-connections': getLeastConnectionsServer,
    'fastest-response': getFastestResponseServer,
    'round-robin': getRoundRobinServer
};

const strategyNames = config.loadBalancer.strategy === 'ab' ?
    config.loadBalancer.abStrategies :
    [config.loadBalancer.strategy];

strategyNames.forEach(name => {
    if (!strategies[name]) {
        console.log(`Unknown load balancing strategy "${name}", using least-connections`);
    }
});

// what each strategy did with the requests it was given, for comparing them
const strategyStats = new Map();

const getStrategyStats = (name) => {
    if (!strategyStats.has(name)) {
        strategyStats.set(name, { requests: 0, successes: 0, failures: 0, latencies: [] });
    }
    return strategyStats.get(name);
};

const recordStrategy = (name, success, latency) => {
    const stats = getStrategyStats(name);
    stats.requests++;
    if (success) {
        stats.successes++;
        stats.latencies.push(latency);
        if (stats.latencies.length > config.loadBalancer.latencyWindow) stats.latencies.shift();
    } else {
        stats.failures++;
    }
};

const pickStrategy = () => {
    const { strategy, abStrategies, abSplit } = config.loadBalancer;
    const name = strategy === 'ab' ?
        (Math.random() < abSplit ? abStrategies[0] : abStrategies[1]) :
        strategy;
    return strategies[name] ? name : 'least-connections';
};

const checkServerHealth = async (server) => {
    try {
        const response = await axios.get(`${server.url}/health`, {
            timeout: config.healthCheck.timeout
        });

        if (response.status === 200) {
            server.successCount++;
            server.failCount = 0;
            if (server.successCount >= config.healthCheck.healthyThreshold) server.healthy = true;
        }
        return true;
    } catch (error) {
        server.failCount++;
        server.successCount = 0;
        if (server.failCount >= config.healthCheck.unhealthyThreshold) server.healthy = false;
        return false;
    }
};

setInterval(() => {
    servers.forEach(server => checkServerHealth(server));
}, config.healthCheck.interval);

const getCircuitBreakerState = (serverUrl) => {
    if (!serverStates.has(serverUrl)) {
        serverStates.set(serverUrl, {
            status: 'CLOSED',
            failures: 0,
            lastError: null,
            lastSuccess: Date.now()
        });
    }
    return serverStates.get(serverUrl);
};

const updateCircuitBreaker = (serverUrl, success) => {
    const state = getCircuitBreakerState(serverUrl);

    if (success) {
        state.failures = Math.max(0, state.failures - 1);
        state.lastSuccess = Date.now();
        if (state.status === 'HALF_OPEN') {
            state.status = 'CLOSED';
        }
    } else {
        state.failures++;
        state.lastError = Date.now();

        if (state.failures >= config.circuitBreaker.failureThreshold) {
            state.status = 'OPEN';
        }
    }
};

const handleRequest = async (server, req) => {
    const circuitState = getCircuitBreakerState(server.url);

    // open stays open until the reset timeout has passed since the last error, then one more try
    if (circuitState.status === 'OPEN') {
        const timeSinceError = Date.now() - circuitState.lastError;

        if (timeSinceError > config.circuitBreaker.resetTimeout) {
            circuitState.status = 'HALF_OPEN';
        } else {
            throw new Error('Circuit breaker is OPEN');
        }
    }

    server.activeConnections++;
    const startTime = Date.now();

    try {
        const response = await axios.post(`${server.url}/detect`, req.body, {
            timeout: 30000
        });

        // real request latency, smoothed, for the fastest-response strategy and /metrics
        const latency = Date.now() - startTime;
        server.lastResponse = latency;
        server.avgResponse = server.avgResponse ? server.avgResponse * 0.8 + latency * 0.2 : latency;
        server.totalRequests++;
        updateCircuitBreaker(server.url, true);

        if (redisClient && redisClient.isReady) {
            try {
                const cacheKey = JSON.stringify({
                    message: req.body.message.toLowerCase(),
                    platform: req.body.platform.toLowerCase()
                });
                // console.log("caching data of responses...");
                
                await redisClient.set(cacheKey, JSON.stringify(response.data), {
                    EX: 3600
                });
            } catch (cacheError) {
                console.log("Redis cache write error: " + cacheError);
            }
        }

        return response.data;
    } catch (error) {
        updateCircuitBreaker(server.url, false);
        throw error;
    } finally {
        server.activeConnections--;
    }
};

router.post('/detect-harassment', async (req, res) => {
    const errors = [];
    let result = null;
    
    try {
        const cacheKey = JSON.stringify({
            message: req.body.message.toLowerCase(),
            platform: req.body.platform.toLowerCase()
        });
        
        // a reconnecting client would queue the read and hold the request, so skip the cache then
        const cachedData = redisClient && redisClient.isReady ? await redisClient.get(cacheKey) : null;
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }
    } catch (cacheError) {
        console.log("Redis cache error: " + cacheError);
    }

    const availableServers = servers.filter(server => {
        const state = getCircuitBreakerState(server.url);
        return server.healthy || state.status === 'HALF_OPEN';
    });

    // the strategy picks who goes first, the rest are the failover, each tried once
    const strategyName = pickStrategy();
    const first = strategies[strategyName]();
    const ordered = first ?
        [first, ...availableServers.filter(server => server !== first)] :
        availableServers;
    const startTime = Date.now();

    res.set('x-lb-strategy', strategyName);

    for (const server of ordered) {
        try {
            result = await handleRequest(server, req);
            server.errorRate = Math.max(0, server.errorRate - 0.1);
            server.weight = Math.min(1, server.weight + 0.1);

            recordStrategy(strategyName, true, Date.now() - startTime);
            res.set('x-served-by', server.url);
            return res.json(result);
        } catch (error) {
            errors.push(`${server.url}: ${error.message}`);
            server.errorRate = Math.min(1, server.errorRate + 0.1);
            server.weight = Math.max(0.1, server.weight - 0.1);
        }
    }

    recordStrategy(strategyName, false);
    res.status(503).json({
        error: 'All servers failed to process request',
        details: errors,
        retryAfter: 5
    });
});

router.get('/metrics', (req, res) => {
    const metrics = servers.map(server => ({
        url: server.url,
        healthy: server.healthy,
        activeConnections: server.activeConnections,
        totalRequests: server.totalRequests,
        averageResponseTime: Math.round(server.avgResponse),
        errorRate: server.errorRate,
        weight: server.weight,
        circuitBreakerStatus: getCircuitBreakerState(server.url).status
    }));

    res.json(metrics);
});

// the A/B view: each strategy's share of traffic, success rate and latency on the same live requests
router.get('/metrics/strategies', (req, res) => {
    const { strategy, abStrategies, abSplit } = config.loadBalancer;
    const results = Object.fromEntries(
        Array.from(strategyStats.entries()).map(([name, stats]) => [
            name,
            {
                requests: stats.requests,
                successes: stats.successes,
                failures: stats.failures,
                successRate: stats.requests ?
                    (stats.successes / stats.requests * 100).toFixed(2) + '%' : null,
                latency: stats.latencies.length ?
                    performanceMetrics.calculateStats(stats.latencies) : null
            }
        ])
    );

    res.json({
        mode: strategy,
        ...(strategy === 'ab' && { abStrategies, abSplit }),
        strategies: results
    });
});


const performanceMetrics = {
    calculatePercentile: (values, percentile) => {
        const sorted = [...values].sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[index];
    },

    // sorted copy first, so the median is the middle value and the caller's array is untouched
    calculateStats: (input) => {
        const values = [...input].sort((a, b) => a - b);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;
        return {
            min: Math.min(...values),
            max: Math.max(...values),
            avg: avg,
            median: values.length % 2 === 0 ? 
                (values[values.length/2 - 1] + values[values.length/2]) / 2 : 
                values[Math.floor(values.length/2)],
            stdDev: Math.sqrt(variance),
            p95: performanceMetrics.calculatePercentile(values, 95),
            p99: performanceMetrics.calculatePercentile(values, 99)
        };
    }
};

router.get('/test-servers', async (req, res) => {
    const {
        duration = 30,    
        concurrent = 20,  
        interval = 100    
    } = req.query;

    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);
    
    const testResults = {
        overview: {
            testDuration: duration,
            concurrentRequests: concurrent,
            requestInterval: interval,
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString()
        },
        serverMetrics: new Map(),
        responseTimes: [],
        errors: [],
        loadBalancerMetrics: {
            // filled from each response's x-lb-strategy header
            strategyUsage: {}
        }
    };

    servers.forEach(server => {
        testResults.serverMetrics.set(server.url, {
            requests: 0,
            successful: 0,
            failed: 0,
            responseTimes: [],
            errors: [],
            circuitBreakerTrips: 0
        });
    });

    const makeRequest = async () => {
        const requestStart = Date.now();
        const payload = {
            username: "TestUser",
            message: "Test message " + Math.random(),
            platform: "LinkedIn"
        };

        try {
            const result = await axios.post(
                `https://harassment-saver-extension.onrender.com/api/v1/moderation/detect-harassment`,
                // `http://localhost:3001/api/v1/moderation/detect-harassment`,
                payload,
                { timeout: 10000 }
            );
            
            const responseTime = Date.now() - requestStart;
            testResults.responseTimes.push(responseTime);

            const strategy = result.headers['x-lb-strategy'];
            if (strategy) {
                const usage = testResults.loadBalancerMetrics.strategyUsage;
                usage[strategy] = (usage[strategy] || 0) + 1;
            }

            const serverUrl = result.headers['x-served-by'];
            if (serverUrl && testResults.serverMetrics.has(serverUrl)) {
                const serverMetrics = testResults.serverMetrics.get(serverUrl);
                serverMetrics.requests++;
                serverMetrics.successful++;
                serverMetrics.responseTimes.push(responseTime);
            }

            testResults.overview.successfulRequests++;
            return { success: true, responseTime };
        } catch (error) {
            const errorData = {
                timestamp: new Date().toISOString(),
                error: error.message,
                serverUrl: error.response?.headers?.['x-served-by'],
                statusCode: error.response?.status
            };
            
            testResults.errors.push(errorData);
            testResults.overview.failedRequests++;
            
            if (errorData.serverUrl && testResults.serverMetrics.has(errorData.serverUrl)) {
                const serverMetrics = testResults.serverMetrics.get(errorData.serverUrl);
                serverMetrics.failed++;
                serverMetrics.errors.push(errorData);
            }
            
            return { success: false, error: errorData };
        } finally {
            testResults.overview.totalRequests++;
        }
    };

    const runConcurrentRequests = async () => {
        const requests = Array(parseInt(concurrent)).fill().map(() => makeRequest());
        await Promise.all(requests);
        await new Promise(resolve => setTimeout(resolve, interval));
    };

    try {
        while (Date.now() < endTime) {
            await runConcurrentRequests();
        }

        const finalMetrics = {
            testDuration: {
                planned: duration,
                actual: (Date.now() - startTime) / 1000
            },
            overview: {
                ...testResults.overview,
                successRate: (testResults.overview.successfulRequests / testResults.overview.totalRequests * 100).toFixed(2) + '%',
                requestsPerSecond: (testResults.overview.totalRequests / duration).toFixed(2),
                averageConcurrency: (testResults.overview.totalRequests / (duration * 1000 / interval)).toFixed(2)
            },
            responseTimeMetrics: performanceMetrics.calculateStats(testResults.responseTimes),
            loadBalancerMetrics: testResults.loadBalancerMetrics,
            serverMetrics: Object.fromEntries(
                Array.from(testResults.serverMetrics.entries()).map(([url, metrics]) => [
                    url,
                    {
                        ...metrics,
                        successRate: (metrics.successful / metrics.requests * 100).toFixed(2) + '%',
                        responseTimeMetrics: metrics.responseTimes.length ? 
                            performanceMetrics.calculateStats(metrics.responseTimes) : null,
                        errorRate: (metrics.failed / metrics.requests * 100).toFixed(2) + '%',
                        lastErrors: metrics.errors.slice(-5) // Last 5 errors
                    }
                ])
            ),
            errors: {
                total: testResults.errors.length,
                uniqueErrors: new Set(testResults.errors.map(e => e.error)).size,
                lastErrors: testResults.errors.slice(-5),
                errorCategories: testResults.errors.reduce((acc, err) => {
                    acc[err.statusCode] = (acc[err.statusCode] || 0) + 1;
                    return acc;
                }, {})
            },
            systemMetrics: {
                memory: process.memoryUsage(),
                cpu: process.cpuUsage()
            }
        };

        res.json(finalMetrics);
    } catch (error) {
        res.status(500).json({
            error: 'Test execution failed',
            message: error.message,
            partialResults: testResults
        });
    }
});



module.exports = router;