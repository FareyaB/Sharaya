// components/CustomText.js
import React from 'react';
import { Text } from 'react-native';

const CustomText = ({ style, weight = 'regular', ...props }) => {
  const fontFamily = {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  }[weight] || 'Poppins-Regular';

  return <Text style={[{ fontFamily }, style]} {...props} />;
};

export default CustomText;