import { useEffect, useState } from 'react';

export default function FooterFact() {
  const [fact, setFact] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/today');
        const json = await res.json();
        setFact(json.text || '');
      } catch (e) { setFact(''); }
    })();
  }, []);
  return (
    <footer style={{ marginTop: 40, padding: 10, borderTop: '1px solid #ddd' }}>
      <strong>Useless fact of the day:</strong> {fact}
    </footer>
  );
}
