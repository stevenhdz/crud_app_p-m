import { useEffect, useState } from 'react';
import axios from "axios";

export default function FooterFact() {
  const [fact, setFact] = useState('');


  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await axios.get(
          "https://uselessfacts.jsph.pl/api/v2/facts/today",
          { signal: controller.signal }
        );
        setFact(res?.data?.text || "");
      } catch (e) {
        if (!axios.isCancel(e)) setFact("");
      }
    })();

    return () => controller.abort();
  }, []);
  return (
    <footer style={{ marginTop: 40, padding: 10, borderTop: '1px solid #ddd' }}>
      <strong>Useless fact of the day:</strong> {fact}
    </footer>
  );
}
