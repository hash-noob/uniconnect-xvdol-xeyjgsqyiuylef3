import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';


const Card = ({ heading, description, children, style }) => {
  return (
    <Surface style={[styles.card, style]}>
      {heading && <Text style={styles.heading}>{heading}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
      {children && <View style={styles.childrenContainer}>{children}</View>}
    </Surface>
  );
};


const styles = StyleSheet.create({
  card: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 4, // Controls the shadow depth
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 15,
    color: '#666',
    marginBottom: 10, // Add margin bottom if there are children
  },
  childrenContainer: {
    marginTop: 5, // Space between description and children
  },
});

export default Card;