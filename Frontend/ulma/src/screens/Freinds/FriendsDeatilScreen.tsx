import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import axiosInstance from '@/api/axios';
import { RouteProp, useNavigation } from '@react-navigation/native';
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
  route: RouteProp<{ params: { guestId: number; name: string; category: string; phoneNumber: string | null; isEditing: boolean } }, 'params'>;
}

const categoryOptions = ['가족', '친척', '친구', '직장', '지인', '기타', '학교'];

function FriendsDetailScreen({ route }: FriendsDetailScreenProps) {
  const { guestId, name: initialName, category: initialCategory, phoneNumber: initialPhoneNumber, isEditing = false } = route.params;
  const navigation = useNavigation();
  const [summary, setSummary] = useState<FriendSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || '');
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false); // 카테고리 모달 상태

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

  const handleSave = async () => {
    try {
      await axiosInstance.patch(`/guest`, {
        guestId: guestId,
        guestName: name,
        guestCategory: category,
        guestNumber: phoneNumber,
      });
      navigation.setParams({ isEditing: false }); // 수정 후 수정 모드 해제
      fetchFriendDetails(); // 저장 후 최신 정보 다시 불러오기
    } catch (error) {
      console.error('친구 정보를 저장하는 데 실패했습니다:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '가족':
        return colors.PINK;
      case '친척':
        return colors.PINK;
      case '친구':
        return colors.GREEN_700;
      case '직장':
        return colors.PASTEL_BLUE;
      case '지인':
        return colors.PASTEL_BLUE;
      case '기타':
        return colors.GRAY_300;
      case '학교':
        return colors.PURPLE;
      default:
        return '#e0e0e0';
    }
  };

  const renderFriendSummaryCard = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {isEditing ? (
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="이름을 입력하세요"
          />
        ) : (
          <Text style={styles.name}>{name}</Text>
        )}

        {isEditing ? (
          <TouchableOpacity style={[styles.categoryButton, { backgroundColor: getCategoryColor(category) }]} onPress={() => setIsCategoryModalVisible(true)}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.categoryButton, { backgroundColor: getCategoryColor(category) }]}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.phoneNumber}>
        Phone <Text style={styles.colorGreen}>|</Text>{' '}
        {isEditing ? (
          <TextInput
            style={[styles.phoneNumberInput, { borderWidth: 1, borderColor: colors.GRAY_300, padding: 10 }]} // 테두리와 패딩 추가
            value={phoneNumber || ''} // phoneNumber 값을 올바르게 설정
            onChangeText={(text) => setPhoneNumber(text)} // phoneNumber 업데이트
            placeholder="휴대폰 번호를 입력하세요"
            keyboardType="phone-pad"
          />
        ) : (
          formatPhoneNumber(phoneNumber)
        )}
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
      <View style={styles.transactionLeftContent}>
        <Text style={styles.transactionName} numberOfLines={1} ellipsizeMode="tail">{item.Name}</Text>
      </View>
      <View style={styles.transactionRightContent}>
        <Text style={[styles.transactionAmount, item.amount > 0 ? styles.receivedText : styles.givenText]}>
          {item.amount > 0 ? `+${item.amount.toLocaleString()}원` : `${item.amount.toLocaleString()}원`}
        </Text>
        <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  const renderCategoryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isCategoryModalVisible}
      onRequestClose={() => setIsCategoryModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>카테고리 선택</Text>
          <ScrollView>
            {categoryOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.categoryOption, { backgroundColor: getCategoryColor(option) }]}
                onPress={() => {
                  setCategory(option);
                  setIsCategoryModalVisible(false);
                }}
              >
                <Text style={styles.categoryOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={colors.BLACK} />;
  }

  return (
    <View style={styles.container}>
      {renderFriendSummaryCard()}
      {renderCategoryModal()}

      {isEditing ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      ) : null}

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
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_300,
    paddingBottom: 4,
    width: '70%',
  },
  categoryButton: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  categoryText: {
    fontSize: 14,
    color: colors.WHITE,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  phoneNumberInput: {
    fontSize: 14,
    color: '#666',
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_300,
    paddingBottom: 4,
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
    color: colors.GREEN_700,
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
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  received: {
    borderLeftColor: colors.GREEN_700,
    borderLeftWidth: 4,
  },
  given: {
    borderLeftColor: colors.PINK,
    borderLeftWidth: 4,
  },
  transactionLeftContent: {
    flex: 1,
    marginRight: 8,
  },
  transactionRightContent: {
    alignItems: 'flex-end',
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
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
  saveButton: {
    marginBottom: 16,
    backgroundColor: colors.GREEN_700,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  categoryOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  categoryOptionText: {
    fontSize: 16,
    color: 'white',
  },
});

export default FriendsDetailScreen;

