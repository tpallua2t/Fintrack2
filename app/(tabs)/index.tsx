import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BellRing, Plus, ChevronRight, Coffee, ShoppingBag, Chrome as Home, Car, Utensils } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const BalanceCard = ({ title, amount, isHighlighted = false }) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  
  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={animatedStyle}>
        <LinearGradient
          colors={isHighlighted 
            ? ['#3a1c71', '#d76d77', '#ffaf7b'] 
            : ['#2C3E50', '#4CA1AF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.balanceCard, isHighlighted && styles.highlightedCard]}
        >
          <Text style={styles.balanceTitle}>{title}</Text>
          <Text style={styles.balanceAmount}>{amount}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const BudgetProgress = ({ category, icon, current, total, color }) => {
  const progress = Math.min(current / total, 1);
  const progressWidth = `${progress * 100}%`;
  
  const getIcon = () => {
    switch (icon) {
      case 'coffee':
        return <Coffee size={20} color="#FFFFFF" />;
      case 'shopping':
        return <ShoppingBag size={20} color="#FFFFFF" />;
      case 'home':
        return <Home size={20} color="#FFFFFF" />;
      case 'car':
        return <Car size={20} color="#FFFFFF" />;
      case 'food':
        return <Utensils size={20} color="#FFFFFF" />;
      default:
        return <Coffee size={20} color="#FFFFFF" />;
    }
  };
  
  return (
    <View style={styles.budgetCard}>
      <View style={styles.budgetHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {getIcon()}
        </View>
        <View style={styles.budgetInfo}>
          <Text style={styles.budgetCategory}>{category}</Text>
          <Text style={styles.budgetAmount}>
            €{current} <Text style={styles.budgetTotal}>/ €{total}</Text>
          </Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill, 
              { width: progressWidth, backgroundColor: color }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </View>
    </View>
  );
};

const DailyChallenge = () => {
  return (
    <LinearGradient
      colors={['rgba(0, 230, 118, 0.2)', 'rgba(0, 230, 118, 0.05)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.challengeCard}
    >
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>Daily Challenge</Text>
        <View style={styles.challengeReward}>
          <Text style={styles.challengeRewardText}>+5 coins</Text>
        </View>
      </View>
      
      <Text style={styles.challengeDescription}>
        Don't spend more than €10 on coffee today
      </Text>
      
      <TouchableOpacity style={styles.challengeButton}>
        <Text style={styles.challengeButtonText}>Accept Challenge</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const RecentTransaction = ({ title, amount, date, category, isExpense }) => {
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[
          styles.transactionIcon, 
          { backgroundColor: isExpense ? '#FF4081' : '#00E676' }
        ]}>
          {isExpense ? <ShoppingBag size={16} color="#FFFFFF" /> : <Plus size={16} color="#FFFFFF" />}
        </View>
        <View>
          <Text style={styles.transactionTitle}>{title}</Text>
          <Text style={styles.transactionCategory}>{category} • {date}</Text>
        </View>
      </View>
      <Text style={[
        styles.transactionAmount, 
        { color: isExpense ? '#FF4081' : '#00E676' }
      ]}>
        {isExpense ? '-' : '+'}€{amount}
      </Text>
    </View>
  );
};

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Alex</Text>
            <Text style={styles.date}>Monday, October 9</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <BellRing size={24} color="#FFFFFF" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.balanceCardsContainer}
        >
          <BalanceCard title="Total Balance" amount="€8,540.35" isHighlighted />
          <BalanceCard title="Savings" amount="€3,250.00" />
          <BalanceCard title="Investments" amount="€2,145.80" />
        </ScrollView>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Budget Overview</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color="#FFEB3B" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.budgetSection}>
          <BudgetProgress 
            category="Coffee" 
            icon="coffee"
            current={25} 
            total={30} 
            color="#FF9800"
          />
          <BudgetProgress 
            category="Shopping" 
            icon="shopping"
            current={250} 
            total={500} 
            color="#FF4081"
          />
          <BudgetProgress 
            category="Groceries" 
            icon="food"
            current={320} 
            total={400} 
            color="#00E676"
          />
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Challenge</Text>
        </View>
        
        <DailyChallenge />
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color="#FFEB3B" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.transactionsSection}>
          <RecentTransaction 
            title="Coffee Shop" 
            amount="4.50" 
            date="Today, 9:30 AM" 
            category="Food & Drinks"
            isExpense
          />
          <RecentTransaction 
            title="Supermarket" 
            amount="32.80" 
            date="Yesterday" 
            category="Groceries"
            isExpense
          />
          <RecentTransaction 
            title="Salary" 
            amount="2,500.00" 
            date="Oct 5" 
            category="Income"
            isExpense={false}
          />
        </View>
      </ScrollView>
      
      <TouchableOpacity style={styles.addButton}>
        <Plus size={24} color="#121212" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B0BEC5',
    marginTop: 4,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4081',
  },
  balanceCardsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  balanceCard: {
    width: width * 0.7,
    padding: 20,
    borderRadius: 16,
    marginRight: 16,
  },
  highlightedCard: {
    shadowColor: '#FFEB3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFEB3B',
    marginRight: 4,
  },
  budgetSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  budgetCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetCategory: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  budgetAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  budgetTotal: {
    fontFamily: 'Inter-Regular',
    color: '#B0BEC5',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  challengeCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  challengeReward: {
    backgroundColor: 'rgba(255, 235, 59, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  challengeRewardText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFEB3B',
  },
  challengeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    lineHeight: 24,
  },
  challengeButton: {
    backgroundColor: '#00E676',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  challengeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#121212',
    textTransform: 'uppercase',
  },
  transactionsSection: {
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  transactionCategory: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#B0BEC5',
  },
  transactionAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFEB3B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFEB3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});