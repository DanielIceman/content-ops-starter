import '../css/main.css';
import { LanguageProvider } from '../utils/language-context';

export default function MyApp({ Component, pageProps }) {
    return (
        <LanguageProvider>
            <Component {...pageProps} />
        </LanguageProvider>
    );
}
