#!/usr/bin/env python
import pandas as pd
import numpy as np

df=pd.read_csv("final_ML.csv")
from sklearn.model_selection import train_test_split
X_train,X_test,Y_train,Y_test=train_test_split(df[['Power']],df['Price'],random_state=0)
print("X_train{}".format(X_train.shape))
print("X_test{}".format(X_test.shape))
print("Y_train{}".format(Y_train.shape))
print("Y_test{}".format(Y_test.shape))
from sklearn import linear_model as lm
regr=lm.LinearRegression()
Xtrain=np.asanyarray(X_train[['Power']])
Ytrain=np.asanyarray(Y_train)
regr.fit(Xtrain,Ytrain)
#The coeff
print("Coefficients:",regr.coef_)
print("Intercept:",regr.intercept_)


#Q4.Predict the value of price
y_hat=0.5248285440385301+0.47544363*Xtrain
#X_train["New_Price"]=regr.predict(x_train)
#y1=X_test["New_Price"]
X_train,X_train,Y_test,Y_train=train_test_split(df["power","Price","Mileage"])

train_test_split(df["power","engine","mileage"],df["Price"],random_state=0)
print()