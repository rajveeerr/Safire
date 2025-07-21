export default function capitalizeWords(str) {
    if (!str) return str;
    
    let result = str.toLowerCase();
    
    result = result.charAt(0).toUpperCase() + result.slice(1);
    
    for (let i = 0; i < result.length - 1; i++) {
      if (result[i] === ' ') {
        result = result.substring(0, i + 1) + 
                 result.charAt(i + 1).toUpperCase() + 
                 result.substring(i + 2);
      }
    }

    return result;
}
