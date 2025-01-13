import React, { useState, useEffect } from 'react'
import Button from '../Button'
import Loader from '../Loader'
import Utils from 'utils'
import clsx from 'clsx'

import './signInWithGoogle.scss'

interface TokenResponse {
  access_token: string
  expires_in: number
  hd: string
  prompt: string
  token_type: string
  scope: string
  state?: string
  error?: string
  error_description?: string
  error_uri?: string
}

interface TokenClient {
  requestAccessToken(): void
}

interface SignInWithGoogleProps {
  googleApi: string
  clientId: string
  scope: string
  apiCall: (data: { provider: string; token: string }) => Promise<unknown>
  responseHandler?: (data: unknown) => void
  extraClass?: string
}

function SignInWithGoogle({
  googleApi,
  clientId,
  scope,
  apiCall,
  responseHandler,
  extraClass,
  ...rest
}: SignInWithGoogleProps) {
  const [client, setClient] = useState<TokenClient | null>(null)
  const [googleLoaded, setGoogleLoaded] = useState(false)

  const handleGoogleSignIn = async (tokenResponse: TokenResponse) => {
    if (tokenResponse?.access_token) {
      try {
        const res = await apiCall({
          provider: 'google',
          token: tokenResponse.access_token
        })

        responseHandler?.(res)
      } catch {
        Utils.toastError('Failed to login with google')
      }
    }
  }

  let retries = 0
  const maxRetries = 14
  const checkGoogle = () => {
    if (retries >= maxRetries) {
      return
    }
    retries += 1
    if (window?.google) {
      setGoogleLoaded(true)
    } else {
      setTimeout(checkGoogle, 1000)
    }
  }

  useEffect(() => {
    checkGoogle()
  }, [])

  useEffect(() => {
    const initializeGsi = () => {
      if (!googleLoaded) {
        return
      }
      setClient(
        window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          callback: handleGoogleSignIn,
          scope
        })
      )
    }

    if (!document.getElementById('google-client-script')) {
      const script = document.createElement('script')
      script.src = googleApi
      script.onload = initializeGsi
      script.async = true
      script.id = 'google-client-script'
      document.querySelector('head')?.appendChild(script)
    }

    return () => {
      document.getElementById('google-client-script')?.remove()
    }
  }, [googleLoaded])

  function getToken() {
    client?.requestAccessToken()
  }

  return (
    <div className='google-login-wrapper'>
      {client ? (
        <Button
          onClick={getToken}
          empty
          extraClass={clsx('google-button', extraClass)}
          data-testid='googleBtn'
          {...rest}
        >
          <div className='google-btn-content'>
            <img
              alt='Google'
              className='google-logo'
              src='https://avatars.githubusercontent.com/u/1342004'
            />
            Sign In with Google
          </div>
        </Button>
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default SignInWithGoogle
