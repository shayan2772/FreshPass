import { ThemedStatusBar } from "@/src/components/themedStatusBar";
import { setupRTL } from "@/src/constant/functions";
import { initI18n } from "@/src/i18n/index";
import { persistor, store } from "@/src/state/store";
import { Font } from "@/src/theme/fonts";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import i18n from "i18next";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";
import "../global.css";
import * as SystemUI from "expo-system-ui";
import { LogBox } from "react-native";
SystemUI.setBackgroundColorAsync("#FEFAE0");
LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({
    fontRegular: Font.fontRegular,
    fontMedium: Font.fontMedium,
    fontBold: Font.fontBold,
    fontExtraBold: Font.fontExtraBold,
  });

  useEffect(() => {
    (async () => {
      await initI18n();
      setReady(true);
    })();
  }, []);

  if (!ready || !fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate
          persistor={persistor}
          loading={null}
          onBeforeLift={() => {
            // Sync i18n with Redux persisted language after rehydration
            // Ensure i18n is initialized before calling changeLanguage
            if (!i18n || !i18n.isInitialized) {
              return;
            }
            
            const state = store.getState();
            if (
              state?.general?.language &&
              i18n.language !== state.general.language
            ) {
              try {
                i18n.changeLanguage(state.general.language);
                setupRTL(state.general.language);
              } catch (error) {
                console.warn("Error changing language:", error);
              }
            }
          }}
        >
          <PortalProvider>
            <I18nextProvider i18n={i18n}>
              <ThemedStatusBar />
              <Slot />
            </I18nextProvider>
          </PortalProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
