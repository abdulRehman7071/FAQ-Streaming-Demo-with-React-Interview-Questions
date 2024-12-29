export async function* simulateStream(text: string, delay = 50) {
    const words = text.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  