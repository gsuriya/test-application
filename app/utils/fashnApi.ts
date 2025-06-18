const FASHN_API_KEY = process.env.NEXT_PUBLIC_FASHN_API_KEY || 'fa-hOIWy0HtMdFa-oGG5TUxVjGHSxf6yupWlSjZJ'
const FASHN_BASE_URL = 'https://api.fashn.ai/v1'

export interface TryOnParams {
  model_image: string
  garment_image: string
  category?: 'auto' | 'tops' | 'bottoms' | 'one-pieces'
  mode?: 'performance' | 'balanced' | 'quality'
  num_samples?: number
  seed?: number
}

export interface TryOnResponse {
  id: string
  error?: string
}

export interface StatusResponse {
  id: string
  status: 'starting' | 'in_queue' | 'processing' | 'completed' | 'failed'
  output?: string[]
  error?: string
}

export async function runTryOn(modelImageBase64: string, garmentImageUrl: string): Promise<string> {
  const params: TryOnParams = {
    model_image: modelImageBase64,
    garment_image: garmentImageUrl,
    category: 'auto',
    mode: 'performance',
    num_samples: 1,
    seed: 42
  }

  const response = await fetch(`${FASHN_BASE_URL}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FASHN_API_KEY}`
    },
    body: JSON.stringify(params)
  })

  if (!response.ok) {
    throw new Error(`Failed to start try-on: ${response.statusText}`)
  }

  const result: TryOnResponse = await response.json()
  
  if (result.error) {
    throw new Error(result.error)
  }

  return result.id
}

export async function checkStatus(id: string): Promise<StatusResponse> {
  const response = await fetch(`${FASHN_BASE_URL}/status/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${FASHN_API_KEY}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to check status: ${response.statusText}`)
  }

  const result: StatusResponse = await response.json()
  return result
}

export async function pollUntilComplete(id: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const status = await checkStatus(id)
        
        if (status.status === 'completed' && status.output) {
          resolve(status.output)
        } else if (status.status === 'failed') {
          reject(new Error(status.error || 'Try-on failed'))
        } else {
          // Continue polling every 2 seconds
          setTimeout(poll, 2000)
        }
      } catch (error) {
        reject(error)
      }
    }
    
    poll()
  })
} 