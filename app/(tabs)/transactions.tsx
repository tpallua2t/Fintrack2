import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, CreditCard, ArrowDown, ArrowUp, Calendar, X, ShoppingBag, Coffee, Chrome as Home, Car, Utensils, Wifi, Check, Plus } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

// Transaction categories with their icons and colors
const categories = [
  { id: 'shopping', name: 'Shopping', icon: 'shopping', color: '#FF4081' },
  { id: 'food', name: 'Food & Drinks', icon: 'food', color: '#FF9800' },
  { id: 'transport', name: 'Transport', icon: 'car', color: '#03A9F4' },
  { id: 'housing', name: 'Housing', icon: 'home', color: '#8BC34A' },
  { id: 'subscriptions', name: 'Subscriptions', icon: 'wifi', color: '#9C27B0' },
  { id: 'other', name: 'Other', icon: 'creditcard', color: '#607D8B' },
];

// Sample transactions data
const transactionsData = [
  {
    id: '1',
    title: 'Grocery Store',
    amount: 45.80,
    date: 'Today, 15:30',
    category: 'food',
    isExpense: true,
  },
  {
    id: '2',
    title: 'Online Shopping',
    amount: 129.99,
    date: 'Yesterday',
    category: 'shopping',
    isExpense: true,
  },
  {
    id: '3',
    title: 'Salary',
    amount: 2500.00,
    date: 'Oct 5',
    category: 'income',
    isExpense: false,
  },
  {
    id: '4',
    title: 'Rent Payment',
    amount: 850.00,
    date: 'Oct 1',
    category: 'housing',
    isExpense: true,
  },
  {
    id: '5',
    title: 'Netflix Subscription',
    amount: 12.99,
    date: 'Oct 1',
    category: 'subscriptions',
    isExpense: true,
  },
  {
    id: '6',
    title: 'Uber Ride',
    amount: 18.45,
    date: 'Sep 29',
    category: 'transport',
    isExpense: true,
  },
  {
    id: '7',
    title: 'Dinner with Friends',
    amount: 64.30,
    date: 'Sep 28',
    category: 'food',
    isExpense: true,
  },
  {
    id: '8',
    title: 'Freelance Work',
    amount: 350.00,
    date: 'Sep 25',
    category: 'income',
    isExpense: false,
  },
];

// Function to get the icon component based on category
const getCategoryIcon = (categoryId, size = 20, color = '#FFFFFF') => {
  switch (categoryId) {
    case 'shopping':
      return <ShoppingBag size={size} color={color} />;
    case 'food':
      return <Utensils size={size} color={color} />;
    case 'transport':
      return <Car size={size} color={color} />;
    case 'housing':
      return <Home size={size} color={color} />;
    case 'subscriptions':
      return <Wifi size={size} color={color} />;
    case 'income':
      return <ArrowDown size={size} color={color} />;
    default:
      return <CreditCard size={size} color={color} />;
  }
};

// Function to get category color
const getCategoryColor = (categoryId) => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.color : '#607D8B';
};

const TransactionItem = ({ transaction, onPress }) => {
  const { title, amount, date, category, isExpense } = transaction;
  
  return (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => onPress(transaction)}
    >
      <View style={styles.transactionLeft}>
        <View style={[
          styles.categoryIcon,
          { backgroundColor: getCategoryColor(category) }
        ]}>
          {getCategoryIcon(category)}
        </View>
        <View>
          <Text style={styles.transactionTitle}>{title}</Text>
          <Text style={styles.transactionDate}>{date}</Text>
        </View>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: isExpense ? '#FF4081' : '#00E676' }
      ]}>
        {isExpense ? '-' : '+'}€{amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
};

const FilterChip = ({ label, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.filterChip, active && styles.activeFilterChip]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, active && styles.activeFilterChipText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const AddTransactionModal = ({ visible, onClose }) => {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isExpense, setIsExpense] = useState(true);
  
  const modalScale = useSharedValue(0.9);
  const modalOpacity = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalOpacity.value,
    };
  });
  
  React.useEffect(() => {
    if (visible) {
      modalScale.value = withTiming(1, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      modalOpacity.value = withTiming(1, { duration: 250 });
    } else {
      modalScale.value = withTiming(0.9, { duration: 200 });
      modalOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);
  
  const resetForm = () => {
    setAmount('');
    setTitle('');
    setSelectedCategory(null);
    setIsExpense(true);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleAddTransaction = () => {
    // Add transaction logic would go here
    // For now, just close the modal
    handleClose();
  };
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionTypeContainer}>
            <TouchableOpacity
              style={[
                styles.transactionTypeButton,
                isExpense && styles.activeTransactionType,
              ]}
              onPress={() => setIsExpense(true)}
            >
              <ArrowUp size={20} color={isExpense ? '#FFFFFF' : '#B0BEC5'} />
              <Text style={[
                styles.transactionTypeText,
                isExpense && styles.activeTransactionTypeText,
              ]}>
                Expense
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.transactionTypeButton,
                !isExpense && styles.activeIncomeType,
              ]}
              onPress={() => setIsExpense(false)}
            >
              <ArrowDown size={20} color={!isExpense ? '#FFFFFF' : '#B0BEC5'} />
              <Text style={[
                styles.transactionTypeText,
                !isExpense && styles.activeIncomeTypeText,
              ]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>€</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#B0BEC5"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#B0BEC5"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          
          <Text style={styles.categoriesLabel}>Category</Text>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === item.id && { borderColor: item.color },
                ]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <View style={[styles.categoryIconSmall, { backgroundColor: item.color }]}>
                  {getCategoryIcon(item.id, 16)}
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
                {selectedCategory === item.id && (
                  <View style={[styles.categorySelectedIndicator, { backgroundColor: item.color }]}>
                    <Check size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
          
          <TouchableOpacity
            style={[
              styles.addButton,
              (!amount || !title || !selectedCategory) && styles.disabledButton,
            ]}
            onPress={handleAddTransaction}
            disabled={!amount || !title || !selectedCategory}
          >
            <Text style={styles.addButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState(transactionsData);
  
  const handleTransactionPress = (transaction) => {
    // Navigate to transaction details or show edit modal
    console.log('Transaction pressed:', transaction);
  };
  
  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'expenses') return transaction.isExpense;
    if (activeFilter === 'income') return !transaction.isExpense;
    return transaction.category === activeFilter;
  }).filter(transaction => {
    if (!searchQuery) return true;
    return transaction.title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color="#B0BEC5" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor="#B0BEC5"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <FilterChip
          label="All"
          active={activeFilter === 'all'}
          onPress={() => setActiveFilter('all')}
        />
        <FilterChip
          label="Expenses"
          active={activeFilter === 'expenses'}
          onPress={() => setActiveFilter('expenses')}
        />
        <FilterChip
          label="Income"
          active={activeFilter === 'income'}
          onPress={() => setActiveFilter('income')}
        />
        {categories.map(category => (
          <FilterChip
            key={category.id}
            label={category.name}
            active={activeFilter === category.id}
            onPress={() => setActiveFilter(category.id)}
          />
        ))}
      </ScrollView>
      
      <ScrollView style={styles.transactionList}>
        {filteredTransactions.map(transaction => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onPress={handleTransactionPress}
          />
        ))}
        {filteredTransactions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transactions found</Text>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.floatingActionButton}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color="#121212" />
      </TouchableOpacity>
      
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    height: 50,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#FFEB3B',
  },
  filterChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  activeFilterChipText: {
    color: '#121212',
  },
  transactionList: {
    flex: 1,
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
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  transactionDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#B0BEC5',
  },
  transactionAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
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
  floatingActionButton: {
    position: 'absolute',
    bottom: 40,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    paddingHorizontal: 20,
    paddingVertical: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  transactionTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTransactionType: {
    backgroundColor: '#FF4081',
  },
  activeIncomeType: {
    backgroundColor: '#00E676',
  },
  transactionTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#B0BEC5',
    marginLeft: 8,
  },
  activeTransactionTypeText: {
    color: '#FFFFFF',
  },
  activeIncomeTypeText: {
    color: '#FFFFFF',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  currencySymbol: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    paddingVertical: 8,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 12,
  },
  categoriesLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    margin: 4,
    position: 'relative',
  },
  categoryIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  categorySelectedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#FFEB3B',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 235, 59, 0.3)',
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#121212',
    textTransform: 'uppercase',
  },
});