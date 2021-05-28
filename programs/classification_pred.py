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

lr = LogisticRegression()
gnb = GaussianNB()
svc = LinearSVC(C=1.0)
rfc = RandomForestClassifier()
svcG = SVC(gamma=2, C=1)
gc = GaussianProcessClassifier(1.0 * RBF(1.0))
dt = DecisionTreeClassifier(max_depth=5)
mpl = MLPClassifier(alpha=1, max_iter=1000)
ab = AdaBoostClassifier()
qa = QuadraticDiscriminantAnalysis()

classifiers = {
    "lr": lr,
    "gnb": gnb,
    "svc": svc,
    "svcG": svcG,
    "rfc": rfc,
    "gc": gc,
    "dt": dt,
    "mpl": mpl,
    "ab": ab,
    "qa": qa
}


def get_pred(df, col, var, clsName):
    df = df.fillna(0)
    y = df[col]
    X = df.drop(col, axis=1)
    X_train, X_test, y_train, y_test = \
        train_test_split(X, y, random_state=42)
    cls = classifiers[clsName]
    mod = cls.fit(X_train, y_train)
    y_pred = mod.predict(X_test)
    ind = list(df.index).index(var)

    report = classification_report(y_test, y_pred, output_dict=False)
    y_pred = mod.predict(X)

    return y_pred[ind], report



if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Classification Prediction')
    parser.add_argument('-i', help='input file')
    parser.add_argument('-var', help='csv index')
    parser.add_argument('-cls', help='classifier')
    parser.add_argument('-col', help='column to predict')
    args = parser.parse_args()
    s = {"i", "var","cls","col"} - set(vars(args).keys())
    if len(s) > 0:
        parser.print_help()
        exit(2)
    else:
        i = vars(args)["i"]
        var = vars(args)["var"]
        cls = vars(args)["cls"]
        col = vars(args)["col"]
    df = pd.read_csv(i, index_col=0)
    if var not in df.index:
        print(f"{var} not in the selected file")
        exit(2)
    if (cls not in classifiers.keys()):
        print(f"{cls} no a permitted classifier")
        exit(2)
    if col not in df.columns:
        print(f"{col} not in the selected file")
        exit(2)

    pred,rep= get_pred(df,col,var,cls)
    print("Predicted to be ",pred)
    print(rep)