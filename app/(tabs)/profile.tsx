import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Shield, ChevronRight, LogOut, Coins as Coin, Award, CreditCard, CircleHelp as HelpCircle } from 'lucide-react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../_layout';
import { router } from 'expo-router';

const ProfileHeader = ({ name, email, photoUrl, coins }) => {
  return (
    <LinearGradient
      colors={['#3a1c71', '#d76d77', '#ffaf7b']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.profileHeader}
    >
      <View style={styles.profileInfo}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <User size={40} color="#FFFFFF" />
          </View>
        )}
        <View>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>
      </View>
      
      <View style={styles.coinsContainer}>
        <Coin size={20} color="#FFEB3B" />
        <Text style={styles.coinsText}>{coins} coins</Text>
      </View>
    </LinearGradient>
  );
};

const SettingsSection = ({ title, children }) => {
  return (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

const SettingsItem = ({ icon, title, value, onPress, showSwitch, switchValue, onToggle, showChevron = true }) => {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingsItemLeft}>
        <View style={styles.settingsItemIcon}>
          {icon}
        </View>
        <Text style={styles.settingsItemTitle}>{title}</Text>
      </View>
      
      <View style={styles.settingsItemRight}>
        {value && <Text style={styles.settingsItemValue}>{value}</Text>}
        
        {showSwitch && (
          <Switch
            trackColor={{ false: '#555', true: 'rgba(0, 230, 118, 0.5)' }}
            thumbColor={switchValue ? '#00E676' : '#f4f3f4'}
            ios_backgroundColor="#555"
            onValueChange={onToggle}
            value={switchValue}
          />
        )}
        
        {showChevron && onPress && (
          <ChevronRight size={20} color="#B0BEC5" style={styles.chevron} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/auth');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader
          name="Alex Johnson"
          email="alex.johnson@example.com"
          photoUrl={null}
          coins={120}
        />
        
        <SettingsSection title="Account">
          <SettingsItem
            icon={<User size={20} color="#FFFFFF" />}
            title="Personal Information"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<CreditCard size={20} color="#FFFFFF" />}
            title="Payment Methods"
            value="2 Cards"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<Award size={20} color="#FFFFFF" />}
            title="Achievements"
            value="3/10"
            onPress={() => {}}
          />
        </SettingsSection>
        
        <SettingsSection title="Preferences">
          <SettingsItem
            icon={<Settings size={20} color="#FFFFFF" />}
            title="App Settings"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<Bell size={20} color="#FFFFFF" />}
            title="Notifications"
            showSwitch
            switchValue={notificationsEnabled}
            onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
            showChevron={false}
          />
          <SettingsItem
            icon={<Shield size={20} color="#FFFFFF" />}
            title="Biometric Authentication"
            showSwitch
            switchValue={biometricsEnabled}
            onToggle={() => setBiometricsEnabled(!biometricsEnabled)}
            showChevron={false}
          />
        </SettingsSection>
        
        <SettingsSection title="Support">
          <SettingsItem
            icon={<HelpCircle size={20} color="#FFFFFF" />}
            title="Help Center"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<Shield size={20} color="#FFFFFF" />}
            title="Privacy Policy"
            onPress={() => {}}
          />
        </SettingsSection>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF4081" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>FinTrack v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  coinsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFEB3B',
    marginLeft: 8,
  },
  settingsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B0BEC5',
    marginRight: 8,
  },
  chevron: {
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 30,
    marginHorizontal: 20,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FF4081',
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#B0BEC5',
    textAlign: 'center',
    marginTop: 20,
  },
});