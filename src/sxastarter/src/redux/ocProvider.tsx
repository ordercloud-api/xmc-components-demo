/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { isEqual } from 'lodash'
import { FunctionComponent, useEffect } from 'react'
import { Provider } from 'react-redux'
import { initializeAuth } from './ocAuth'
import logout from './ocAuth/logout'
import { OcConfig, setConfig } from './ocConfig'
import { retrieveOrder } from './ocCurrentOrder'
import ocStore, { useOcDispatch, useOcSelector } from './ocStore'
import { getUser } from './ocUser'
import { useRouter } from 'next/router'
import authAnonymous from './ocAuth/authAnonymous'
import impersonate from './ocAuth/impersonate'

interface OcProviderProps {
  config: OcConfig
  children: any
}

const IMPERSONATION_QUERY_KEY = 'ocImpersonationToken'

const OcInitializer: FunctionComponent<OcProviderProps> = ({ children, config }) => {
  const dispatch = useOcDispatch()
  const isPreviewing = config.isPreviewing
  const { ocConfig, ocAuth, ocUser, ocCurrentOrder } = useOcSelector((s) => ({
    ocConfig: s.ocConfig,
    ocAuth: s.ocAuth,
    ocUser: s.ocUser,
    ocCurrentOrder: s.ocCurrentOrder,
  }))
  const router = useRouter()

  useEffect(() => {
    //router.query is not populated until after first page render
    //so I also check router.asPath for first page load cases (probably most of them)
    const impersonationToken =
      router.query[IMPERSONATION_QUERY_KEY] ||
      router.asPath.split(`?${IMPERSONATION_QUERY_KEY}=`)[1]

    console.log(`isPreviewing: ${isPreviewing}`)

    //do not continue to process this check if auth is loading
    if (ocAuth.loading) return
    if (!ocConfig.value || !isEqual(ocConfig.value, config)) {
      dispatch(setConfig(config))
    } else if (
      // IF there is an impersonation token in the query params
      // AND
      // auth is not initialized OR auth is initialized but it's not impersonating
      // -- notes: the second half of this if statement is important because often times
      // the application has already been loaded anonymously in the CSR users browser.
      // the additional check on ocAuth.isImpersonated guarantees that the impersonation
      // token is utilized.
      typeof impersonationToken === 'string' &&
      (!ocAuth.initialized || (ocAuth.initialized && !ocAuth.isImpersonated))
    ) {
      dispatch(impersonate(impersonationToken))
    } else if (!ocAuth.initialized) {
      dispatch(initializeAuth())
    } else if (!ocAuth.isAuthenticated && ocUser.user) {
      dispatch(logout())
    } else if (!ocAuth.isAuthenticated) {
      dispatch(authAnonymous())
    } else if (ocAuth.isAuthenticated) {
      if (!ocUser.user && !ocUser.loading) {
        dispatch(getUser())
      }
      if (!ocCurrentOrder.initialized) {
        dispatch(retrieveOrder())
      }
    }
  }, [dispatch, config, ocConfig, ocAuth, ocUser, ocCurrentOrder, isPreviewing, router])

  return <>{children}</>
}

const OcProvider: FunctionComponent<OcProviderProps> = ({ children, config }) => {
  return (
    <Provider store={ocStore}>
      <OcInitializer config={config}>{children}</OcInitializer>
    </Provider>
  )
}

export default OcProvider
