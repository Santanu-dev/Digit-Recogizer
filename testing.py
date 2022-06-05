# -*- coding: utf-8 -*-
"""
Created on Fri Apr  2 11:48:03 2021

@author: ShantanuRM
"""
from keras import models

classifier = models.load_model("E:/DigitRecFullProject/model2021.h5")

from keras.preprocessing import image

img = image.load_img("E:/DigitRecFullProject/d.png", target_size= (28, 28), grayscale = True);

import matplotlib.pyplot as plt

plt.imshow(img)

import numpy as np

img = image.img_to_array(img)
img = np.expand_dims(img, axis = 0)

result = classifier.predict(img)
print(np.argmax(result))
result[0]