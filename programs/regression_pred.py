import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from matplotlib.colors import ListedColormap
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_moons, make_circles, make_classification
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.gaussian_process import GaussianProcessClassifier
from sklearn.gaussian_process.kernels import RBF
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
import matplotlib.pyplot as plt

from sklearn import datasets
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.calibration import calibration_curve
from sklearn.metrics import classification_report
import sklearn.metrics as metrics

from sklearn.ensemble import RandomForestRegressor

rf = RandomForestRegressor()

def regression_results(y_true, y_pred):
    # Regression metrics
    mean_absolute_error=metrics.mean_absolute_error(y_true, y_pred) 
    mse=metrics.mean_squared_error(y_true, y_pred) 
    median_absolute_error=metrics.median_absolute_error(y_true, y_pred)
    s = f'MAE: {round(mean_absolute_error,4)} \n MSE: {round(mse,4)} \n RMSE: {round(np.sqrt(mse),4)}'
    return s

def get_pred(df, col, var):
    df = df.fillna(0)
    y = df[col]
    X = df.drop(col, axis=1)
    X_train, X_test, y_train, y_test = \
        train_test_split(X, y, random_state=42)
    mod = rf.fit(X_train,y_train)
    y_pred = rf.predict(X_test)

    ind = list(df.index).index(var)
    s = regression_results(y_test, y_pred)

    y_pred = mod.predict(X)

    return y_pred[ind],s



if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Classification Prediction')
    parser.add_argument('-i', help='input file')
    parser.add_argument('-var', help='csv index')
    parser.add_argument('-col', help='column to predict')
    args = parser.parse_args()
    s = {"i", "var","col"} - set(vars(args).keys())
    if len(s) > 0:
        parser.print_help()
        exit(2)
    else:
        i = vars(args)["i"]
        var = vars(args)["var"]
        col = vars(args)["col"]
    df = pd.read_csv(i, index_col=0)
    if var not in df.index:
        print(f"{var} not in the selected file")
        exit(2)
    if col not in df.columns:
        print(f"{col} not in the selected file")
        exit(2)

    pred,rep= get_pred(df,col,var)
    print("Predicted to be ",pred)
    print(rep)