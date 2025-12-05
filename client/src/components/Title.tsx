import { useEffect } from 'react';
const Title = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};

export default Title;
