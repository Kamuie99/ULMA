import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import axiosInstance from '@/api/axios';
import { RouteProp } from '@react-navigation/native';
import { colors } from '@/constants';

interface FriendSummary {
  totalGiven: number;
  totalReceived: number;
  totalBalance: number;
}

interface Transaction {
  guestId: number;
  Name: string;
  date: string;
  amount: number;
}

interface FriendsDetailScreenProps {
  route: RouteProp<{ params: { guestId: number; name: string; category: string; phoneNumber: string | null } }, 'params'>;
}

function FriendsDetailScreen({ route }: FriendsDetailScreenProps) {
  const { guestId, name, category, phoneNumber } = route.params;
  const [summary, setSummary] = useState<FriendSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriendDetails = useCallback(async () => {
    try {
      const summaryResponse = await axiosInstance.get(`/participant/summary/${guestId}`);
      setSummary(summaryResponse.data);

      const transactionsResponse = await axiosInstance.get(`/participant/${guestId}`);
      setTransactions(transactionsResponse.data.data);
    } catch (error) {
      console.error('친구 상세 정보를 불러오는 데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  }, [guestId]);

  useEffect(() => {
    fetchFriendDetails();
  }, [fetchFriendDetails]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '가족':
        return colors.PINK;
      case '친구':
        return colors.GREEN_700;
      case '직장':
        return colors.PASTEL_BLUE;
      case '지인':
        return colors.PASTEL_BLUE;
      case '기타':
        return colors.GRAY_300;
      default:
        return '#e0e0e0';
    }
  };

  const renderFriendSummaryCard = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{name}</Text>
        <TouchableOpacity style={[styles.categoryButton, { backgroundColor: getCategoryColor(category) }]}>
          <Text style={styles.categoryText}>{category}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.phoneNumber}>
        Phone <Text style={styles.colorGreen}>|</Text> {formatPhoneNumber(phoneNumber)}
      </Text>

      <View style={styles.separator} />

      {summary && (
        <View style={styles.summaryContent}>
          <View>
            <Text style={[styles.amountText, styles.receivedText]}>{`+${summary.totalReceived.toLocaleString()}원`}</Text>
            <Text style={[styles.amountText, styles.givenText]}>{`${summary.totalGiven.toLocaleString()}원`}</Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={summary.totalBalance > 0 ? styles.balancePositive : styles.balanceNegative}>
              {` ${summary.totalBalance.toLocaleString()}원`}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderTransactionCard = ({ item }: { item: Transaction }) => (
    <View style={[styles.transactionCard, item.amount > 0 ? styles.received : styles.given]}>
      <Text style={styles.transactionName}>{item.Name}</Text>
      <Text style={styles.transactionAmount}>
        {item.amount > 0 ? `+${item.amount.toLocaleString()}원` : `${item.amount.toLocaleString()}원`}
      </Text>
      <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={colors.BLACK} />;
  }

  return (
    <View style={styles.container}>
      {/* 친구 카드 + 금액 요약 카드 렌더링 */}
      {renderFriendSummaryCard()}

      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransactionCard}
          keyExtractor={(item) => item.guestId.toString()}
        />
      ) : (
        <Text style={styles.noTransactions}>거래 내역이 없습니다</Text>
      )}
    </View>
  );
}

const formatPhoneNumber = (phoneNumber: string | null) => {
  if (!phoneNumber) return '등록된 번호가 없습니다.';
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  categoryButton: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 14,
    color: colors.WHITE,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  colorGreen: {
    color: colors.GREEN_700,
  },
  separator: {
    height: 1,
    backgroundColor: colors.GRAY_300,
    marginVertical: 16,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountText: {
    fontSize: 16,
    marginTop: 4,
  },
  receivedText: {
    color: colors.BLUE,
  },
  givenText: {
    color: colors.PINK,
  },
  totalContainer: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  },
  balancePositive: {
    color: colors.BLUE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceNegative: {
    color: colors.PINK,
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  received: {
    borderLeftColor: colors.GREEN_700,
    borderLeftWidth: 5,
  },
  given: {
    borderLeftColor: colors.PINK,
    borderLeftWidth: 5,
  },
  transactionName: {
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  noTransactions: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default FriendsDetailScreen;
