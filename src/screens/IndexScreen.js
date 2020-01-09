import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity } from 'react-native';
import { Context } from '../context/BlogContext';
import { Feather } from '@expo/vector-icons';

const IndexScreen = ({ navigation }) => {
  const { state, deleteBlogPost, getBlogPosts } = useContext(Context);

  useEffect(() => {
    getBlogPosts();

    // Rerun when get back to this screen
    const listener = navigation.addListener('didFocus', () => {
      getBlogPosts();
    });

    // Return this function when this screen destroyed completely
    return () => {
      // Remove the listener once the screen is destroyed 
      listener.remove();
    };
  }, [state]);

  return (
    <View style={styles.container}>
      <Button title="Add Post" onPress={() => navigation.navigate('Create')} />
      <FlatList
        data={state}
        keyExtractor={blogPost => blogPost.id + ''}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate('Show', { id: item.id })}>
              <View style={styles.row}>
                <Text style={styles.title}>{item.title} - {item.id}</Text>
                <TouchableOpacity onPress={() => deleteBlogPost(item.id)}>
                  <Feather style={styles.icon} name="trash" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

IndexScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <TouchableOpacity style={styles.iconHeaderRight} onPress={() => navigation.navigate('Create')}>
        <Feather name="plus" size={30} />
      </TouchableOpacity>
    )
  };
};


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: 'gray'
  },
  title: {
    fontSize: 18
  },
  icon: {
    fontSize: 24
  },
  iconHeaderRight: {
    marginRight: 10
  }
});

export default IndexScreen;
