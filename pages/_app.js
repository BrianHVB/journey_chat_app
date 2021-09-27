import { Provider } from "next-auth/client";

import '../styles/globals.css'
import ChatContextProvider from "../context/ChatContextProvider";


function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ChatContextProvider {...pageProps}>
        <Component {...pageProps} />
      </ChatContextProvider>
    </Provider>
  )
}

export default MyApp
