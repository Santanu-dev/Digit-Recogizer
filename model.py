# -*- coding: utf-8 -*-
"""
Created on Thu Feb 11 21:15:39 2021

@author: ShantanuRM
"""

from keras.datasets import mnist
import matplotlib.pyplot as plt
from keras.utils import np_utils
from keras.models import Sequential
from keras.layers import Convolution2D
from keras.layers import MaxPooling2D
from keras.layers import Dropout
from keras.layers import Flatten
from keras.layers import Dense


#load data
(x_train, y_train), (x_test, y_test) = mnist.load_data()
#show one image
plt.imshow(x_train[0])

x_train.shape
x_train = x_train.reshape(x_train.shape[0], 28, 28, 1).astype('float32')
x_test = x_test.reshape(x_test.shape[0], 28, 28, 1).astype('float32')

#normalize the pixels
x_train = x_train / 255
x_test = x_test / 255

#one hot encoding
y_train = np_utils.to_categorical(y_train)
y_test = np_utils.to_categorical(y_test)

#building the model
classifier = Sequential()
classifier.add(Convolution2D(32, (5,5), input_shape = (28, 28, 1), activation = 'relu'))
classifier.add(MaxPooling2D(pool_size = (2, 2)))
classifier.add(Convolution2D(64, (3, 3), activation='relu'))
classifier.add(MaxPooling2D((2, 2)))
classifier.add(Dropout(0.3))
classifier.add(Flatten())
classifier.add(Dense(128, activation='relu'))
classifier.add(Dense(y_train.shape[1], activation='softmax'))

classifier.compile(optimizer = 'adam', loss='categorical_crossentropy', metrics=['accuracy'])

classifier.fit(x_train, y_train, validation_data= (x_test, y_test), epochs=6, batch_size=255)

plt.plot(classifier.history.history['accuracy'])
plt.plot(classifier.history.history['val_accuracy'])

plt.title("model Accuracy")
plt.ylabel('accuracy')
plt.xlabel('epochs')
plt.legend(['train', 'test'], loc = 'upper left')
plt.show()

plt.plot(classifier.history.history['loss'])
plt.plot(classifier.history.history['val_loss'])

plt.title("model Loss")
plt.ylabel('loss')
plt.xlabel('epochs')
plt.legend(['train', 'test'], loc = 'upper left')
plt.show()

classifier.save("model2021.h5")




