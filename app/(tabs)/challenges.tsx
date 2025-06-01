import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Easing, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, ChevronRight, X, Check, Coins as Coin, Gift, TriangleAlert as AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react-native';
import Svg, { G, Circle, Text as SvgText, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Challenge Card Component
const ChallengeCard = ({ challenge, onPress, onClaim }) => {
  const { title, description, reward, progress, deadline, status } = challenge;
  
  const progressPercentage = (progress / 100) * 100;
  
  return (
    <TouchableOpacity
      style={[styles.challengeCard, status === 'completed' && styles.completedCard]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.challengeHeader}>
        <View style={styles.challengeTitleContainer}>
          <Award 
            size={20} 
            color={status === 'completed' ? '#00E676' : '#FFEB3B'} 
            style={styles.challengeIcon} 
          />
          <Text style={styles.challengeTitle}>{title}</Text>
        </View>
        <View style={[
          styles.badgeContainer, 
          { backgroundColor: status === 'completed' ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 235, 59, 0.2)' }
        ]}>
          <Text style={[
            styles.badgeText, 
            { color: status === 'completed' ? '#00E676' : '#FFEB3B' }
          ]}>
            {status === 'completed' ? 'Completed' : status === 'active' ? 'Active' : 'New'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.challengeDescription}>{description}</Text>
      
      <View style={styles.challengeProgressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progressPercentage}%`,
                backgroundColor: status === 'completed' ? '#00E676' : '#FFEB3B'
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
      
      <View style={styles.challengeFooter}>
        <View style={styles.rewardContainer}>
          <Coin size={16} color="#FFEB3B" />
          <Text style={styles.rewardText}>{reward} coins</Text>
        </View>
        
        <Text style={styles.deadlineText}>{deadline}</Text>
      </View>
      
      {status === 'completed' && (
        <TouchableOpacity 
          style={styles.claimButton}
          onPress={onClaim}
        >
          <Text style={styles.claimButtonText}>Claim Reward</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

// Rewards Wheel Component
const RewardsWheel = ({ visible, onClose, onSpin }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  
  const rewards = [
    { id: 1, label: '5 Coins', color: '#FF4081' },
    { id: 2, label: '10 Coins', color: '#00E676' },
    { id: 3, label: '20 Coins', color: '#FF9800' },
    { id: 4, label: '50 Coins', color: '#03A9F4' },
    { id: 5, label: '5% Cashback', color: '#9C27B0' },
    { id: 6, label: 'Try Again', color: '#607D8B' },
    { id: 7, label: '15 Coins', color: '#FFEB3B' },
    { id: 8, label: 'Free Coffee', color: '#8BC34A' },
  ];
  
  const sliceDegree = 360 / rewards.length;
  
  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSpinResult(null);
    
    // Random between 720 and 1080 degrees (2-3 full rotations)
    const randomDegree = Math.floor(Math.random() * 360) + 720;
    const spinDuration = 3000;
    
    Animated.timing(spinValue, {
      toValue: randomDegree,
      duration: spinDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const finalRotation = randomDegree % 360;
      const rewardIndex = Math.floor(finalRotation / sliceDegree);
      const selectedReward = rewards[rewardIndex];
      
      setSpinResult(selectedReward);
      setIsSpinning(false);
    });
  };
  
  const spinDegree = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });
  
  const renderWheelPieces = () => {
    return rewards.map((reward, index) => {
      const rotation = index * sliceDegree;
      const pieAngle = 2 * Math.PI / rewards.length;
      
      // Calculating coordinates for the label
      const labelRadius = 100;
      const labelAngle = rotation + sliceDegree / 2;
      const labelRadians = (labelAngle * Math.PI) / 180;
      const labelX = labelRadius * Math.cos(labelRadians);
      const labelY = labelRadius * Math.sin(labelRadians);
      
      return (
        <G key={reward.id} rotation={rotation}>
          <Path
            d={`M0,0 L${120 * Math.cos(0)},${120 * Math.sin(0)} A120,120 0 0,1 ${120 * Math.cos(pieAngle)},${120 * Math.sin(pieAngle)} Z`}
            fill={reward.color}
          />
          <SvgText
            x={labelX}
            y={labelY}
            fill="white"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            rotation={90 + labelAngle}
          >
            {reward.label}
          </SvgText>
        </G>
      );
    });
  };
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.wheelModalOverlay}>
        <LinearGradient
          colors={['#1E1E1E', '#121212']}
          style={styles.wheelModalContainer}
        >
          <View style={styles.wheelModalHeader}>
            <Text style={styles.wheelModalTitle}>Spin & Win</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.coinsInfo}>
            <Coin size={24} color="#FFEB3B" />
            <Text style={styles.coinsText}>Your Coins: 120</Text>
          </View>
          
          <View style={styles.wheelContainer}>
            <View style={styles.wheelMarker} />
            <Animated.View
              style={[
                styles.wheel,
                { transform: [{ rotate: spinDegree }] }
              ]}
            >
              <Svg height="240" width="240" viewBox="-120 -120 240 240">
                {renderWheelPieces()}
                <Circle cx="0" cy="0" r="20" fill="#1E1E1E" />
              </Svg>
            </Animated.View>
          </View>
          
          {spinResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                You won: <Text style={{ color: spinResult.color }}>{spinResult.label}</Text>!
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.spinButton, isSpinning && styles.spinningButton]}
            onPress={spin}
            disabled={isSpinning}
          >
            <Text style={styles.spinButtonText}>
              {isSpinning ? 'Spinning...' : 'Spin (10 Coins)'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

// Achievements Component
const Achievements = ({ visible, onClose }) => {
  const achievements = [
    {
      id: 1,
      title: 'Budget Master',
      description: 'Stay within budget for 3 consecutive months',
      progress: 2,
      total: 3,
      icon: '🏆'
    },
    {
      id: 2,
      title: 'Saving Star',
      description: 'Save at least €500 in a month',
      progress: 450,
      total: 500,
      icon: '⭐'
    },
    {
      id: 3,
      title: 'Early Bird',
      description: 'Log in to the app for 7 consecutive days',
      progress: 7,
      total: 7,
      icon: '🌅',
      completed: true
    },
    {
      id: 4,
      title: 'Money Tracker',
      description: 'Record 50 transactions',
      progress: 32,
      total: 50,
      icon: '📊'
    },
    {
      id: 5,
      title: 'Challenge Champion',
      description: 'Complete 10 financial challenges',
      progress: 4,
      total: 10,
      icon: '🏅'
    }
  ];
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.achievementsModalOverlay}>
        <LinearGradient
          colors={['#1E1E1E', '#121212']}
          style={styles.achievementsModalContainer}
        >
          <View style={styles.achievementsModalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.achievementsModalTitle}>Achievements</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.achievementsList}>
            {achievements.map(achievement => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementHeader}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementTitleContainer}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    {achievement.completed && (
                      <View style={styles.completedBadge}>
                        <Check size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                </View>
                
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                
                <View style={styles.achievementProgressContainer}>
                  <View style={styles.achievementProgressBackground}>
                    <View 
                      style={[
                        styles.achievementProgressFill, 
                        { 
                          width: `${(achievement.progress / achievement.total) * 100}%`,
                          backgroundColor: achievement.completed ? '#00E676' : '#FFEB3B'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.achievementProgressText}>
                    {achievement.progress}/{achievement.total}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default function Challenges() {
  const [activeTab, setActiveTab] = useState('active');
  const [wheelVisible, setWheelVisible] = useState(false);
  const [achievementsVisible, setAchievementsVisible] = useState(false);
  
  const challenges = [
    {
      id: 1,
      title: 'Coffee Budget Challenge',
      description: 'Keep your coffee expenses under €30 this week',
      reward: 15,
      progress: 80,
      deadline: '3 days left',
      status: 'active'
    },
    {
      id: 2,
      title: 'Savings Boost',
      description: 'Save €50 more than last month',
      reward: 25,
      progress: 100,
      deadline: 'Completed',
      status: 'completed'
    },
    {
      id: 3,
      title: 'No Impulse Shopping',
      description: 'Avoid impulse purchases for 7 days',
      reward: 20,
      progress: 70,
      deadline: '2 days left',
      status: 'active'
    },
    {
      id: 4,
      title: 'Budget Tracking Streak',
      description: 'Log into the app for 5 consecutive days',
      reward: 10,
      progress: 100,
      deadline: 'Completed',
      status: 'completed'
    },
    {
      id: 5,
      title: 'Meal Prep Challenge',
      description: 'Prepare meals at home to save on takeout costs',
      reward: 15,
      progress: 0,
      deadline: '7 days left',
      status: 'new'
    }
  ];
  
  const filteredChallenges = challenges.filter(challenge => {
    if (activeTab === 'active') return challenge.status === 'active' || challenge.status === 'new';
    return challenge.status === 'completed';
  });
  
  const handleChallengePress = (challenge) => {
    console.log('Challenge pressed:', challenge);
  };
  
  const handleClaimReward = (challenge) => {
    setWheelVisible(true);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Challenges</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Challenges
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.challengesContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredChallenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onPress={() => handleChallengePress(challenge)}
            onClaim={() => handleClaimReward(challenge)}
          />
        ))}
        
        {filteredChallenges.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No {activeTab} challenges found
            </Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setAchievementsVisible(true)}
        >
          <Award size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Achievements</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.rewardsButton]}
          onPress={() => setWheelVisible(true)}
        >
          <Gift size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Rewards</Text>
        </TouchableOpacity>
      </View>
      
      <RewardsWheel
        visible={wheelVisible}
        onClose={() => setWheelVisible(false)}
        onSpin={() => {}}
      />
      
      <Achievements
        visible={achievementsVisible}
        onClose={() => setAchievementsVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTab: {
    borderBottomColor: '#FFEB3B',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#B0BEC5',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  challengesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  challengeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#00E676',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  challengeIcon: {
    marginRight: 8,
  },
  challengeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    flex: 1,
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  challengeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B0BEC5',
    marginBottom: 16,
    lineHeight: 20,
  },
  challengeProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#B0BEC5',
    width: 36,
    textAlign: 'right',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFEB3B',
    marginLeft: 4,
  },
  deadlineText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#B0BEC5',
  },
  claimButton: {
    backgroundColor: '#00E676',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  claimButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#121212',
    textTransform: 'uppercase',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#B0BEC5',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  rewardsButton: {
    backgroundColor: '#FFEB3B',
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  wheelModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelModalContainer: {
    width: '90%',
    maxWidth: 360,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  wheelModalHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  wheelModalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  coinsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  coinsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  wheelContainer: {
    width: 240,
    height: 240,
    marginVertical: 20,
    position: 'relative',
  },
  wheel: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelMarker: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFEB3B',
    zIndex: 1,
  },
  resultContainer: {
    marginVertical: 20,
  },
  resultText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  spinButton: {
    backgroundColor: '#FFEB3B',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  spinningButton: {
    backgroundColor: 'rgba(255, 235, 59, 0.5)',
  },
  spinButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#121212',
    textTransform: 'uppercase',
  },
  achievementsModalOverlay: {
    flex: 1,
    backgroundColor: '#121212',
  },
  achievementsModalContainer: {
    flex: 1,
  },
  achievementsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  achievementsModalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  achievementsList: {
    paddingHorizontal: 20,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  completedBadge: {
    backgroundColor: '#00E676',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  achievementDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B0BEC5',
    marginBottom: 16,
  },
  achievementProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementProgressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  achievementProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementProgressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#B0BEC5',
    width: 40,
    textAlign: 'right',
  },
});