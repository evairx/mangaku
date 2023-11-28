import { useState,  useEffect} from "react";

const useQuery = (query) => {
  const [matches, setMatches] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    setHasMounted(true);
    return () => window.removeEventListener("resize", listener);
  }, [query]);

  return hasMounted ? matches : false;
};

export default useQuery;