import React from 'react'
import { View, ActivityIndicator, StyleSheet } from "react-native";

export type LoaderPropsType = {
  type?: string;
};

export const Loader: React.FC<LoaderPropsType> = ({type}) => (
  <View style={[type !== 'fetching' && styles.loading]}>
    <ActivityIndicator animating size="large" />
  </View>
);

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .2)',
  },
})
