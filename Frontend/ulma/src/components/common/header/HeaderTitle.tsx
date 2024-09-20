import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface HeaderTitleProps {
  label: string; // Header title to be displayed
}

function HeaderTitle({label}: HeaderTitleProps) {
  return (
    <View>
      <Text>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});

export default HeaderTitle;
