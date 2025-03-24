import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Linking } from 'react-native';
import { Card, List, Text, Button, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HelpSupport() {
  const [refreshing, setRefreshing] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const faqs = [
    {
      id: 1,
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login screen and tap on "Forgot Password". Follow the instructions sent to your registered email address to create a new password.'
    },
    {
      id: 2,
      question: 'How can I update my profile information?',
      answer: 'You can update your profile by going to the Profile section from the drawer menu. Tap on the edit icon next to your profile information to make changes.'
    },
    {
      id: 3,
      question: 'How do I view my attendance records?',
      answer: 'Navigate to the Attendance section from the menu. You can see your overall attendance and detailed subject-wise records here.'
    },
    {
      id: 4,
      question: 'What should I do if I find incorrect information in my courses?',
      answer: 'If you notice any incorrect information, please contact your faculty advisor or the system administrator through the Contact Support option in this menu.'
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>Help & Support</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Need Assistance?</Text>
          <Text style={styles.description}>
            Our support team is ready to help you with any questions or issues you may encounter while using UniConnect.
          </Text>
          <Button 
            mode="contained" 
            style={styles.contactButton}
            onPress={() => console.log('Contact Support')}
            labelStyle={{color: '#ffffff'}}
          >
            Contact Support
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq) => (
          <React.Fragment key={faq.id}>
            <List.Accordion
              title={faq.question}
              expanded={expandedFaq === faq.id}
              onPress={() => toggleFaq(faq.id)}
              titleStyle={styles.faqQuestion}
              style={styles.faqItem}
              left={props => 
                <MaterialCommunityIcons 
                  {...props} 
                  name="help-circle-outline" 
                  size={24} 
                  color="#000000" 
                />
              }
            >
              <List.Item 
                title={faq.answer} 
                titleNumberOfLines={10}
                titleStyle={styles.faqAnswer}
                style={styles.faqAnswerContainer}
              />
            </List.Accordion>
            <Divider />
          </React.Fragment>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <List.Item
          title="Email Support"
          description="support@uniconnect.edu"
          titleStyle={styles.contactItemTitle}
          descriptionStyle={styles.contactItemDescription}
          left={props => <MaterialCommunityIcons {...props} name="email-outline" size={24} color="#000000" />}
          onPress={() => Linking.openURL('mailto:support@uniconnect.edu')}
          style={styles.contactItem}
        />
        <Divider />
        <List.Item
          title="Phone Support"
          description="+1 (123) 456-7890"
          titleStyle={styles.contactItemTitle}
          descriptionStyle={styles.contactItemDescription}
          left={props => <MaterialCommunityIcons {...props} name="phone-outline" size={24} color="#000000" />}
          onPress={() => Linking.openURL('tel:+11234567890')}
          style={styles.contactItem}
        />
        <Divider />
        <List.Item
          title="Visit Website"
          description="www.uniconnect.edu"
          titleStyle={styles.contactItemTitle}
          descriptionStyle={styles.contactItemDescription}
          left={props => <MaterialCommunityIcons {...props} name="web" size={24} color="#000000" />}
          onPress={() => Linking.openURL('https://www.uniconnect.edu')}
          style={styles.contactItem}
        />
      </View>

      <Card style={[styles.card, styles.tutorialCard]}>
        <Card.Content>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
            <Text style={styles.sectionTitle}>Video Tutorials</Text>
            <View style={styles.developmentTagContainer}>
              <Text style={styles.developmentTag}>In development</Text>
            </View>
          </View>
          <Text style={styles.description}>
            Check out our video tutorials to learn how to use UniConnect effectively.
          </Text>
          <Button 
            mode="outlined" 
            style={styles.tutorialButton}
            onPress={() => console.log('View Tutorials')}
            icon="video"
            labelStyle={{color: '#000000'}}
          >
            View Tutorials
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#000000',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#f5f5f5',
  },
  tutorialCard: {
    backgroundColor: '#f5f5f5',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  description: {
    color: '#000000',
    marginBottom: 20,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: '#000000',
  },
  tutorialButton: {
    borderColor: '#000000',
    borderWidth: 1,
  },
  faqItem: {
    backgroundColor: '#fff',
  },
  faqQuestion: {
    color: '#000000',
    fontWeight: '500',
  },
  faqAnswer: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 20,
  },
  faqAnswerContainer: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  contactItem: {
    paddingVertical: 5,
  },
  contactItemTitle: {
    color: '#000000',
    fontSize: 16,
  },
  contactItemDescription: {
    color: '#000000',
    fontSize: 14,
  },
  developmentTag: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  developmentTagContainer: {
    marginLeft: 8,
  },
}); 