import { useEffect, useRef, useState } from 'react';
import { analyzeImage } from '@/assets/imageColorAnalyzer';
import { useImageColor } from '@/hooks/index';

export default (imageUrl: string | undefined) => {
  const [mainColor, setMainColor] = useState<string | undefined>(undefined);
  const [textColor, setTextColor] = useState<string | undefined>(undefined);
  const [contrastColor, setContrastColor] = useState<string | undefined>(undefined);
  const loading = useRef<boolean>();
  useEffect(() => {
    if(!imageUrl) return;
    if(loading.current) return;
	  loading.current = true;
    analyzeImage(imageUrl).then(res => {
      setMainColor(res.mainColor);
      setTextColor(res.textColor);
      setContrastColor(res.contrastColor);
      loading.current = false;
    })
  }, [imageUrl]);
  return {
    mainColor,
    textColor,
    contrastColor,
    loading
  }
}