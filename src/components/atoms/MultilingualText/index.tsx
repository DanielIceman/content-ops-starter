import React from 'react';
import { useLanguage } from '../../../utils/language-context';

interface MultilingualTextProps {
  textKey?: string;
  defaultText?: string;
  className?: string;
  tag?: React.ElementType;
}

export default function MultilingualText({ 
  textKey, 
  defaultText, 
  className = '', 
  tag: Tag = 'span' 
}: MultilingualTextProps) {
  const { t } = useLanguage();
  
  const text = textKey ? t(textKey) : defaultText;
  
  return <Tag className={className}>{text}</Tag>;
}