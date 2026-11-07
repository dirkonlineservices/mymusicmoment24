/**
 * Serverseitiges Vorrendern einzelner Seiten (Impressum, Datenschutz, AGB, Widerruf,
 * Support, B2B, Autor). Wird beim Build nach dist-ssr/ kompiliert und von server.js genutzt,
 * damit der Inhalt schon im ausgelieferten HTML steht. Im Browser ersetzt die App ihn danach.
 */
import { renderToString } from "react-dom/server";
import { LanguageProvider } from "./context/LanguageContext";
import LegalPage from "./views/LegalPage";
import SupportPage from "./views/SupportPage";
import B2BPage from "./views/B2BPage";
import AuthorPage from "./views/AuthorPage";
import StreamingReleasePage from "./views/StreamingReleasePage";

const noop = () => {};

const PAGES = {
  "/impressum": () => <LegalPage type="impressum" onBackToHome={noop} onSwitchTab={noop} />,
  "/datenschutz": () => <LegalPage type="datenschutz" onBackToHome={noop} onSwitchTab={noop} />,
  "/agb": () => <LegalPage type="agb" onBackToHome={noop} onSwitchTab={noop} />,
  "/widerruf": () => <LegalPage type="widerruf" onBackToHome={noop} onSwitchTab={noop} />,
  "/support": () => <SupportPage onBackToHome={noop} onGoToConfigurator={noop} />,
  "/kontakt": () => <SupportPage onBackToHome={noop} onGoToConfigurator={noop} />,
  "/b2b": () => <B2BPage onBackToHome={noop} onGoToConfigurator={noop} />,
  "/kooperation": () => <B2BPage onBackToHome={noop} onGoToConfigurator={noop} />,
  "/agenturen": () => <B2BPage onBackToHome={noop} onGoToConfigurator={noop} />,
  "/autor-dirk-schmetzer": () => <AuthorPage onBackToHome={noop} onGoToConfigurator={noop} />,
  "/streaming": () => <StreamingReleasePage onBackToHome={noop} onOpenCheckout={noop} />,
  "/spotify": () => <StreamingReleasePage onBackToHome={noop} onOpenCheckout={noop} />,
  "/streaming-release": () => <StreamingReleasePage onBackToHome={noop} onOpenCheckout={noop} />,
};

/**
 * HTML der Seite oder null, wenn diese Adresse nicht vorgerendert wird.
 * internalPath = deutscher Pfad (z. B. /datenschutz), publicPath = aufgerufene Adresse (z. B. /en/privacy)
 */
export function renderPage(internalPath, lang = "de", publicPath = internalPath) {
  const Page = PAGES[internalPath];
  if (!Page) return null;
  return renderToString(
    <LanguageProvider language={lang} path={publicPath}>
      <Page />
    </LanguageProvider>
  );
}
