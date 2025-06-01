import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, Share2, TrendingUp, TrendingDown, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { VictoryPie, VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLine } from 'victory-native';

const { width } = Dimensions.get('window');

// Month selector
const MonthSelector = ({ currentMonth, onPreviousMonth, onNextMonth }) => {
  return (
    <View style={styles.monthSelector}>
      <TouchableOpacity onPress={onPreviousMonth}>
        <ChevronLeft size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.currentMonth}>{currentMonth}</Text>
      <TouchableOpacity onPress={onNextMonth}>
        <ChevronRight size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

// Summary Card
const SummaryCard = ({ title, amount, change, isPositive }) => {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={styles.summaryAmount}>€{amount}</Text>
      <View style={styles.changeContainer}>
        {isPositive ? (
          <TrendingUp size={16} color="#00E676" />
        ) : (
          <TrendingDown size={16} color="#FF4081" />
        )}
        <Text style={[
          styles.changeText,
          { color: isPositive ? '#00E676' : '#FF4081' }
        ]}>
          {change}%
        </Text>
      </View>
    </View>
  );
};

// Category breakdown with pie chart
const CategoryBreakdown = ({ data }) => {
  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Spending by Category</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.pieChartContainer}>
        <VictoryPie
          data={data}
          width={width - 80}
          height={220}
          colorScale={data.map(item => item.color)}
          innerRadius={70}
          labelRadius={({ innerRadius }) => innerRadius + 30}
          style={{
            labels: {
              fill: 'white',
              fontSize: 12,
              fontWeight: 'bold',
            },
          }}
          labels={({ datum }) => `${datum.y}%`}
        />
      </View>
      
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.x}</Text>
            <Text style={styles.legendValue}>€{item.amount}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Monthly comparison chart
const MonthlyComparison = ({ data }) => {
  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Income vs Expenses</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <VictoryChart
        width={width - 40}
        height={250}
        theme={VictoryTheme.material}
        domainPadding={{ x: 25 }}
      >
        <VictoryAxis
          tickValues={data.map((_, i) => i)}
          tickFormat={data.map(d => d.x)}
          style={{
            axis: { stroke: 'rgba(255, 255, 255, 0.2)' },
            tickLabels: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: 10 },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => `€${t}`}
          style={{
            axis: { stroke: 'rgba(255, 255, 255, 0.2)' },
            tickLabels: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: 10 },
            grid: { stroke: 'rgba(255, 255, 255, 0.05)' },
          }}
        />
        <VictoryBar
          data={data.map(d => ({ x: d.x, y: d.income }))}
          style={{ data: { fill: '#00E676', width: 12 } }}
          barRatio={0.8}
          alignment="start"
        />
        <VictoryBar
          data={data.map(d => ({ x: d.x, y: d.expenses }))}
          style={{ data: { fill: '#FF4081', width: 12 } }}
          barRatio={0.8}
          alignment="end"
        />
      </VictoryChart>
      
      <View style={styles.barChartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#00E676' }]} />
          <Text style={styles.legendLabel}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF4081' }]} />
          <Text style={styles.legendLabel}>Expenses</Text>
        </View>
      </View>
    </View>
  );
};

// Forecast card
const ForecastCard = ({ data }) => {
  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Balance Forecast</Text>
        <TouchableOpacity>
          <AlertTriangle size={20} color="#FFEB3B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.forecastContainer}>
        <VictoryChart
          width={width - 40}
          height={200}
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
        >
          <VictoryAxis
            tickFormat={(t) => `${t}`}
            style={{
              axis: { stroke: 'rgba(255, 255, 255, 0.2)' },
              tickLabels: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: 10 },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `€${t}`}
            style={{
              axis: { stroke: 'rgba(255, 255, 255, 0.2)' },
              tickLabels: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: 10 },
              grid: { stroke: 'rgba(255, 255, 255, 0.05)' },
            }}
          />
          <VictoryLine
            data={data}
            style={{
              data: { 
                stroke: "#FFEB3B",
                strokeWidth: 3
              }
            }}
          />
        </VictoryChart>
      </View>
      
      <LinearGradient
        colors={['rgba(255, 235, 59, 0.1)', 'rgba(255, 235, 59, 0.03)']}
        style={styles.forecastInsight}
      >
        <Text style={styles.insightTitle}>AI Insight</Text>
        <Text style={styles.insightText}>
          Based on your spending patterns, we predict a balance of €2,680 by the end of the month. Consider reducing your dining expenses to increase savings.
        </Text>
      </LinearGradient>
    </View>
  );
};

export default function Analytics() {
  const [currentMonth, setCurrentMonth] = useState('October 2023');
  
  const months = [
    'January 2023',
    'February 2023',
    'March 2023',
    'April 2023',
    'May 2023',
    'June 2023',
    'July 2023',
    'August 2023',
    'September 2023',
    'October 2023',
    'November 2023',
    'December 2023',
  ];
  
  const [monthIndex, setMonthIndex] = useState(9); // October
  
  const handlePreviousMonth = () => {
    if (monthIndex > 0) {
      setMonthIndex(monthIndex - 1);
      setCurrentMonth(months[monthIndex - 1]);
    }
  };
  
  const handleNextMonth = () => {
    if (monthIndex < months.length - 1) {
      setMonthIndex(monthIndex + 1);
      setCurrentMonth(months[monthIndex + 1]);
    }
  };
  
  // Sample data for pie chart
  const pieData = [
    { x: 'Food', y: 35, amount: 420, color: '#FF9800' },
    { x: 'Shopping', y: 25, amount: 300, color: '#FF4081' },
    { x: 'Housing', y: 20, amount: 240, color: '#8BC34A' },
    { x: 'Transport', y: 10, amount: 120, color: '#03A9F4' },
    { x: 'Other', y: 10, amount: 120, color: '#607D8B' },
  ];
  
  // Sample data for bar chart
  const barData = [
    { x: 'Week 1', income: 800, expenses: 500 },
    { x: 'Week 2', income: 600, expenses: 700 },
    { x: 'Week 3', income: 900, expenses: 600 },
    { x: 'Week 4', income: 1100, expenses: 800 },
  ];
  
  // Sample data for forecast
  const forecastData = [
    { x: '1', y: 3200 },
    { x: '5', y: 3000 },
    { x: '10', y: 2900 },
    { x: '15', y: 2800 },
    { x: '20', y: 2750 },
    { x: '25', y: 2700 },
    { x: '30', y: 2680 },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>
      
      <MonthSelector
        currentMonth={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.summaryContainer}>
          <SummaryCard
            title="Income"
            amount="3,400.00"
            change="5"
            isPositive={true}
          />
          <SummaryCard
            title="Expenses"
            amount="2,600.00"
            change="12"
            isPositive={false}
          />
        </View>
        
        <CategoryBreakdown data={pieData} />
        
        <MonthlyComparison data={barData} />
        
        <ForecastCard data={forecastData} />
      </ScrollView>
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
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  currentMonth: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  summaryTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#B0BEC5',
    marginBottom: 8,
  },
  summaryAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieChartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  legendContainer: {
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  legendValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  barChartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  forecastContainer: {
    marginBottom: 16,
  },
  forecastInsight: {
    padding: 16,
    borderRadius: 12,
  },
  insightTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFEB3B',
    marginBottom: 8,
  },
  insightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
});