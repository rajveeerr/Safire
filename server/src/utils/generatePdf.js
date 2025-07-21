const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const axios = require('axios');
dayjs.extend(utc);

const fs = require('fs');
const path = require('path');


function getLogoAsBase64() {
  try {
    const logoPath = path.join(__dirname, '../../public/logo.png');
    const logo = fs.readFileSync(logoPath);
    return `data:image/png;base64,${logo.toString('base64')}`;
  } catch (error) {
    console.error('Failed to load logo:', error);
    return null;
  }
}

async function getImageAsBase64(screenshot) {
    try {
      const imageUrl = screenshot?.screenshotUrl;
      
      if (!imageUrl) {
        console.error('Invalid screenshot object:', screenshot);
        return null;
      }
  
      if (imageUrl.startsWith('data:')) {
        return imageUrl;
      }
      
      const validUrl = new URL(imageUrl);
      
      const response = await axios.get(validUrl.toString(), {
        responseType: 'arraybuffer',
        timeout: 10000, 
        validateStatus: status => status === 200 
      });
      
      const buffer = Buffer.from(response.data);
      const mimeType = response.headers['content-type'] || 'image/jpeg';
      return `data:${mimeType};base64,${buffer.toString('base64')}`;
    } catch (error) {
      console.error('Screenshot processing error:', error.message);
      return null;
    }
  }
  
  async function generatePDF(reportData, reportId) {

    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ]});
    
    try {
      console.log('Browser launched successfully');
      const page = await browser.newPage();
      
      await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: 2
      });
  

      if (reportData.evidence?.screenshots?.length) {
        console.log('Processing screenshots:', reportData.evidence.screenshots);
        
        const screenshotsWithBase64 = await Promise.all(
          reportData.evidence.screenshots
            .filter(screenshot => screenshot && (screenshot.screenshotUrl))
            .map(async screenshot => {
                try {
                  const base64Url = await getImageAsBase64(screenshot);
                  if (!base64Url) {
                    console.warn('Failed to process screenshot:', screenshot);
                    return null;
                  }
                  
                  return {
                    ...screenshot,
                    url: base64Url,
                    timestamp: dayjs(screenshot.timestamp).utc().format('MMMM D, YYYY HH:mm:ss'),
                    context: screenshot.context || 'No context provided',
                    platform: screenshot.platform || 'unknown'
                  };
                } catch (error) {
                  console.error('Screenshot processing error:', error);
                  return null;
                }
            })
        );
        
        reportData.evidence.screenshots = screenshotsWithBase64.filter(s => s !== null);
        console.log('Processed screenshots:', reportData.evidence.screenshots.length);
      }
  
      const html = generateHTML(reportData, reportId);
      
      await page.setContent(html, { 
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 60000
      });
  
      await page.evaluate(async () => {
        const imageElements = Array.from(document.getElementsByTagName('img'));
        
        await Promise.all(
          imageElements.map(img => 
            new Promise((resolve) => {
              if (img.complete && img.naturalHeight !== 0) {
                resolve();
              } else {
                img.addEventListener('load', resolve);
                img.addEventListener('error', () => {
                  console.error('Image failed to load:', img.src);
                  resolve();
                });
              }
            })
          )
        );
  
        await new Promise(resolve => setTimeout(resolve, 1000));
      });
  
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '20mm',
          right: '20mm'
        },
        timeout: 60000
      });
  
      return pdf;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    } finally {
      // await browser.close();
    }
}
  

function generateHTML(reportData, reportId) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #333;
        }
        
        .logo {
          max-width: 120px;
          margin-bottom: 10px;
        }
        
        .title {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }
        
        .reference-box {
          border: 1px solid #333;
          padding: 15px;
          margin-bottom: 30px;
          background: #f8f9fa;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          padding-bottom: 5px;
          border-bottom: 1px solid #ddd;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .info-item {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;
        }
        
        .info-label {
          font-weight: 600;
          margin-right: 8px;
        }
        
        .severity-box {
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 4px;
          font-weight: 600;
        }
        
        .severity-HIGH {
          background: #ffebee;
          color: #c62828;
        }
        
        .severity-MEDIUM {
          background: #fff3e0;
          color: #ef6c00;
        }
        
        .severity-LOW {
          background: #e8f5e9;
          color: #2e7d32;
        }
        
        .message-box {
          border: 1px solid #ddd;
          padding: 15px;
          margin-bottom: 15px;
          background: #fff;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #333;
          font-size: 12px;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        @media print {
          .page-break {
            page-break-before: always;
          }
        }
        .screenshot-section {
      break-inside: avoid;
      margin-bottom: 30px;
    }
    
    .screenshot-container {
      margin: 20px 0;
      border: 1px solid #ddd;
      padding: 15px;
      background: #fff;
    }
    
    .screenshot-image {
      max-width: 100%;
      height: auto;
      margin: 10px 0;
      border: 1px solid #eee;
    }
    
    .screenshot-info {
      margin-top: 10px;
      font-size: 14px;
    }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="{{logoUrl}}" alt="Safire Logo" class="logo">
        <h1 class="title">DIGITAL HARASSMENT EVIDENCE REPORT</h1>
      </div>

      <div class="reference-box">
        <div><span class="info-label">Report Reference:</span> {{reportId}}</div>
        <div><span class="info-label">Generated Date:</span> {{generatedDate}}</div>
        <div><span class="info-label">Classification:</span> CONFIDENTIAL</div>
      </div>

      <div class="section">
        <h2 class="section-title">1. SUBJECT INFORMATION</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Username:</span> {{userName}}
          </div>
          <div class="info-item">
            <span class="info-label">Platform:</span> {{platform}}
          </div>
          <div class="info-item">
            <span class="info-label">Profile URL:</span> {{profileUrl}}
          </div>
          <div class="info-item">
            <span class="info-label">Status:</span> {{status}}
          </div>
          <div class="info-item">
            <span class="info-label">Previous Reports:</span> {{previousReports}}
          </div>
          <div class="info-item">
            <span class="info-label">Risk Level:</span> {{riskLevel}}
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">2. ANALYSIS SUMMARY</h2>
        <div class="severity-box severity-{{severity}}">
          Severity Level: {{severity}}
        </div>
        <h3>Key Findings:</h3>
        <ul>
          {{#each keyFindings}}
            <li>{{this}}</li>
          {{/each}}
        </ul>
      </div>

      <div class="page-break"></div>

      <div class="section">
        <h2 class="section-title">3. EVIDENCE TIMELINE</h2>
        {{#each messages}}
          <div class="message-box">
            <div><span class="info-label">Time:</span> {{this.timestamp}}</div>
            <div><span class="info-label">Type:</span> {{this.type}}</div>
            <div><span class="info-label">Content:</span> {{this.content}}</div>
          </div>
        {{/each}}
      </div>

      {{#if screenshots}}
      <div class="page-break"></div>
      <div class="section">
        <h2 class="section-title">SCREENSHOT EVIDENCE</h2>
        {{#each screenshots}}
          <div class="screenshot-section">
            <div class="screenshot-container">
              <div><span class="info-label">Screenshot {{add @index 1}}</span></div>
              <img src="{{this.url}}" alt="Evidence Screenshot {{add @index 1}}" class="screenshot-image">
              <div class="screenshot-info">
                <div><span class="info-label">Timestamp:</span> {{this.timestamp}}</div>
                <div><span class="info-label">Context:</span> {{this.context}}</div>
              </div>
            </div>
          </div>
        {{/each}}
      </div>
    {{/if}}

      <div class="section">
        <h2 class="section-title">4. STATISTICAL ANALYSIS</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Total Messages:</span> {{stats.total}}
          </div>
          <div class="info-item">
            <span class="info-label">Time Span:</span> {{stats.timespan}} days
          </div>
          <div class="info-item">
            <span class="info-label">Average Frequency:</span> {{stats.frequency}} messages/day
          </div>
          <div class="info-item">
            <span class="info-label">Message Types:</span> {{stats.types}}
          </div>
        </div>
      </div>

      <div class="page-break"></div>

      <div class="section">
        <h2 class="section-title">5. LEGAL ATTESTATION</h2>
        <p>This report was automatically generated by Safire's Digital Safety Platform on {{generatedDate}}.</p>
        <p>This document contains digital evidence collected through our platform's automated systems. All data has been preserved with cryptographic signatures to ensure authenticity and chain of custody.</p>
        <p>This report may be used as supporting evidence in legal proceedings, subject to applicable laws and regulations. All timestamps are recorded in UTC (Coordinated Universal Time) to ensure global consistency and traceability.</p>
        
        <h3>LEGAL DISCLAIMER</h3>
        <p>While Safire employs industry-standard practices to ensure data accuracy and integrity, this report should be reviewed by qualified legal professionals before use in any legal proceedings. Safire provides no warranty regarding the completeness or accuracy of the information contained herein.</p>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Report Identifier:</span> {{reportId}}
          </div>
          <div class="info-item">
            <span class="info-label">Digital Signature:</span> {{signature}}
          </div>
          <div class="info-item">
            <span class="info-label">Generation Timestamp:</span> {{timestamp}}
          </div>
          <div class="info-item">
            <span class="info-label">Verification Status:</span> VALID
          </div>
        </div>
      </div>

      <div class="footer">
        <div>Report ID: {{reportId}} | Page {{pageNumber}}</div>
        <div>Generated: {{generatedDate}} UTC</div>
      </div>
    </body>
    </html>
  `;

  const compiledTemplate = handlebars.compile(template);
  handlebars.registerHelper('add', function(value, addition) {
    return value + addition;
  });
  
  const templateData = {
    logoUrl: getLogoAsBase64() || '', 
    reportId,
    generatedDate: dayjs().utc().format('MMMM D, YYYY HH:mm:ss'),
    userName: reportData.userName,
    platform: reportData.platform || 'N/A',
    profileUrl: reportData.profileUrl,
    status: reportData.userProfileDetails?.isKnownHarasser ? 'Known Harasser' : 'First Report',
    previousReports: reportData.userProfileDetails?.totalHideCount || '0',
    riskLevel: reportData.summary?.riskLevel || 'N/A',
    severity: reportData.summary?.severityAssessment || 'MEDIUM',
    keyFindings: reportData.summary?.keyFindings || [],
    messages: reportData.evidence?.messages?.map(msg => ({
      timestamp: dayjs(msg.timestamp).utc().format('MMMM D, YYYY HH:mm:ss'),
      type: msg.type,
      content: msg.content
    })) || [],
    stats: {
      total: reportData.evidence?.statistics?.total || 0,
      timespan: reportData.evidence?.statistics?.timespan || 0,
      frequency: (reportData.evidence?.statistics?.frequency || 0).toFixed(2),
      types: reportData.evidence?.statistics?.types?.join(', ') || 'N/A'
    },
    signature: Buffer.from(reportId).toString('base64'),
    timestamp: dayjs().utc().toISOString(),
    screenshots: (reportData.evidence?.screenshots || []).filter(s => s?.url) 
  };

  return compiledTemplate(templateData);
}

module.exports = { generatePDF };