import { useEffect, useRef, useState } from 'react';
import { analyzeImage } from '@/assets/imageColorAnalyzer';

export default (imageUrl: string | undefined) => {
  const [imageColor, setImageColor] = useState<string | undefined>(undefined);
  const loading = useRef<boolean>();
  useEffect(() => {
    if(!imageUrl) return;
    if(loading.current) return;
	  loading.current = true;
    analyzeImage(imageUrl).then(res => {
      setImageColor(res);
      loading.current = false;
    })
  }, [imageUrl]);
  return {
    imageColor,
    loading
  }
}