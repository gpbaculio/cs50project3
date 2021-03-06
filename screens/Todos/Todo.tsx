import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import TodosContext from './TodosContext';

export interface TodoType {
  complete: boolean;
  createdAt: string;
  id: string;
  text: string;
  userId: string;
}

const EditTodoTextSchema = Yup.object().shape({
  text: Yup.string().required('Required'),
});

const Todo: React.FC<TodoType> = ({
  complete: initComplete,
  id,
  text: initText,
  userId,
}) => {
  const {setTodos, todos, currentFilter} = useContext(TodosContext);
  const [complete, setComplete] = useState(initComplete);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(initText);
  const [error, setError] = useState('');
  useEffect(() => {
    setComplete(initComplete);
  }, [initComplete]);
  const toggleEditing = () => {
    setEditing(!editing);
    setLoading(false);
  };

  const toggleComplete = () => {
    // optimistic response
    setComplete(!complete);
    setLoading(true);
    fetch(
      `https://5e65ab532aea440016afb25f.mockapi.io/users/${userId}/todos/${id}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({complete: !complete}),
      },
    )
      .then(response => response.json())
      .then(
        response => {
          if (response !== 'Not found') {
            setTodos(
              todos.map(t => {
                if (t.id === response.id) {
                  return response;
                } else {
                  return t;
                }
              }),
            );
            if (currentFilter === 'All') {
              setComplete(response.complete);
              setLoading(false);
            }
          }
        },
        toggleError => {
          setError(toggleError);
          setLoading(false);
        },
      );
  };

  const deleteTodo = () => {
    Alert.alert(
      `Delete ${text}?`,
      'Please Confirm to Proceed',
      [
        {
          text: 'Confirm',
          onPress: () => {
            setLoading(true);
            fetch(
              `https://5e65ab532aea440016afb25f.mockapi.io/users/${userId}/todos/${id}`,
              {
                method: 'DELETE',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              },
            )
              .then(response => response.json())
              .then(
                deletedTodo => {
                  if (deletedTodo) {
                    setTodos(todos.filter(todo => todo.id !== deletedTodo.id));
                  }
                },
                deleteTodoError => {
                  setError(deleteTodoError);
                  setLoading(false);
                },
              );
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const textComponent = (
    <TouchableOpacity style={styles.textWrap} onLongPress={toggleEditing}>
      <Text style={[styles.text, complete && styles.complete]}>{text}</Text>
    </TouchableOpacity>
  );

  const removeButton = (
    <TouchableOpacity onPress={deleteTodo}>
      <MaterialIcons name={'delete'} size={24} color={'#cc9a9a'} />
    </TouchableOpacity>
  );

  const editingComponent = (
    <Formik
      initialValues={{
        text,
      }}
      validationSchema={EditTodoTextSchema}
      onSubmit={(values, {setFieldError}) => {
        setLoading(true);
        fetch(
          `https://5e65ab532aea440016afb25f.mockapi.io/users/${userId}/todos/${id}`,
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({text: values.text}),
          },
        )
          .then(response => response.json())
          .then(
            todo => {
              setText(todo.text);
              setEditing(false);
              setLoading(false);
            },
            editTodoTextError => {
              setFieldError('text', editTodoTextError);
              setLoading(false);
            },
          );
      }}>
      {({values, handleChange, handleSubmit, touched, errors}) => (
        <View style={styles.textWrap}>
          <TextInput
            returnKeyType="done"
            onBlur={() => {
              setEditing(false);
            }}
            blurOnSubmit={false}
            onSubmitEditing={handleSubmit}
            onChangeText={handleChange('text')}
            autoFocus
            value={values.text}
            style={styles.input}
          />
          {touched.text && errors.text && (
            <Text style={styles.errorMessage}>{errors.text}</Text>
          )}
        </View>
      )}
    </Formik>
  );

  return (
    <View style={styles.container}>
      <Switch
        disabled={loading}
        onValueChange={toggleComplete}
        value={complete}
      />
      {editing ? editingComponent : textComponent}
      {!editing && removeButton}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator animating size="small" />
        </View>
      )}
      {!!error && <Text style={styles.errorMessage}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  errorMessage: {fontSize: 10, color: 'red'},
  container: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  complete: {
    textDecorationLine: 'line-through',
  },
  textWrap: {
    flex: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
  },
  text: {
    fontSize: 16,
    color: '#4d4d4d',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: '#4D4D4D',
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .2)',
  },
});

export default Todo;
