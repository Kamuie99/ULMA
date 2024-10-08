import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity, View, Modal, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@/constants';
import { friendsNavigations } from '@/constants/navigations';

import FriendsListScreen from '@/screens/Freinds/FriendsListScreen';
import FriendsHomeScreen from '@/screens/Freinds/FriendsHomeScreen';
import FriendsAddScreen from '@/screens/Freinds/FriendsAddScreen';
import FriendsDetailScreen from '@/screens/Freinds/FriendsDeatilScreen';

export type freindsStackParamList = {
  [friendsNavigations.FRIENDS_HOME]: undefined;
  [friendsNavigations.FRIENDS_LIST]: undefined;
  [friendsNavigations.FRIENDS_ADD]: undefined;
  [friendsNavigations.FREINDS_DETAIL]: { guestId: number; isEditing: boolean };
};

const Stack = createStackNavigator<freindsStackParamList>();

function FriendsStackNavigator() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOptionsPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleEditPress = (navigation, route) => {
    const currentEditing = route.params?.isEditing || false;
    navigation.setParams({ isEditing: !currentEditing });
    setModalVisible(false);
  };

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.WHITE,
        },
        headerStyle: {
          backgroundColor: colors.WHITE,
        },
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        headerTintColor: colors.BLACK,
      }}
    >
      <Stack.Screen
        name={friendsNavigations.FRIENDS_LIST}
        component={FriendsListScreen}
        options={({ navigation }) => ({
          headerTitle: '지인 목록',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate(friendsNavigations.FRIENDS_ADD)}
              style={{ marginRight: 15 }}
            >
              <Icon name="add" size={24} color={colors.BLACK} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name={friendsNavigations.FRIENDS_HOME}
        component={FriendsHomeScreen}
        options={{
          headerTitle: '지인 관리',
        }}
      />
      <Stack.Screen
        name={friendsNavigations.FRIENDS_ADD}
        component={FriendsAddScreen}
        options={{
          headerTitle: '지인 추가',
        }}
      />
      <Stack.Screen
        name={friendsNavigations.FREINDS_DETAIL}
        component={FriendsDetailScreen}
        options={({ route, navigation }) => ({
          headerTitle: '거래내역 조회',
          headerRight: () => (
            <View>
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={handleOptionsPress}
              >
                <Icon name="ellipsis-vertical" size={24} color={colors.BLACK} />
              </TouchableOpacity>

              {/* 옵션 모달 */}
              <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
              >
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                  <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => handleEditPress(navigation, route)}
                  >
                    <Text style={styles.optionText}>지인 수정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionButton}>
                    <Text style={styles.optionText}>추후 개발 예정</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    right: 10,
    top: 60,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    color: colors.BLACK,
  },
});

export default FriendsStackNavigator;
