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

def get_compair(df,col):
    df = df.fillna(0)
    y = df[col]
    X = df.drop(col,axis=1)
    X_train, X_test, y_train, y_test = \
            train_test_split(X, y, random_state=42)

    # Create classifiers
    lr = LogisticRegression()
    gnb = GaussianNB()
    svc = LinearSVC(C=1.0)
    rfc = RandomForestClassifier()
    svc2 = SVC(gamma=2, C=1)
    gc = GaussianProcessClassifier(1.0 * RBF(1.0))
    dt = DecisionTreeClassifier(max_depth=5)
    mpl = MLPClassifier(alpha=1, max_iter=1000)
    ab = AdaBoostClassifier()
    qa = QuadraticDiscriminantAnalysis()


    # #############################################################################
    # Plot calibration plots

    plt.figure(figsize=(10, 10))
    ax1 = plt.subplot2grid((3, 1), (0, 0), rowspan=2)
    ax2 = plt.subplot2grid((3, 1), (2, 0))

    ax1.plot([0, 1], [0, 1], "k:", label="Perfectly calibrated")
    for clf, name in [(lr, 'Logistic'),
                      (gnb, 'Naive Bayes'),
                      (svc, 'Support Vector Classification'),
                      (rfc, 'Random Forest'),
                      (svc2,"Suport Vector Gamma"),
                      (gc, "GaussianProcessClassifier"),
                     (dt,"Decision tree"),
                     (mpl,"MPL classifier"),
                     (ab,"Ada boost classifier"),
                     (qa,"Quadric Discrimination Analysis")]:
        clf.fit(X_train, y_train)
        if hasattr(clf, "predict_proba"):
            prob_pos = clf.predict_proba(X_test)[:, 1]
        else:  # use decision function
            prob_pos = clf.decision_function(X_test)
            prob_pos = \
                (prob_pos - prob_pos.min()) / (prob_pos.max() - prob_pos.min())
        fraction_of_positives, mean_predicted_value = \
            calibration_curve(y_test, prob_pos, n_bins=10)

        ax1.plot(mean_predicted_value, fraction_of_positives, "s-",
                 label="%s" % (name, ))

        ax2.hist(prob_pos, range=(0, 1), bins=10, label=name,
                 histtype="step", lw=2)

    ax1.set_ylabel("Fraction of positives")
    ax1.set_ylim([-0.05, 1.05])
    ax1.legend(loc="lower right")
    ax1.set_title('Calibration plots  (reliability curve)')

    ax2.set_xlabel("Mean predicted value")
    ax2.set_ylabel("Count")
    ax2.legend(loc="upper center", ncol=2)

    plt.tight_layout()
    return plt


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Make a scatter plot')
    parser.add_argument('-i', help='input file')
    parser.add_argument('-o', help='output file png')
    parser.add_argument('-var', help='csv index')
    args = parser.parse_args()
    s = {"i", "o", "var"} - set(vars(args).keys())
    if len(s) > 0:
        parser.print_help()
        exit(2)
    else:
        i = vars(args)["i"]
        o = vars(args)["o"]
        var = vars(args)["var"]
    df = pd.read_csv(i, index_col=0)
    if var not in df.columns:
        print(f"{var} not in the selected file")
        exit(2)

    plt = get_compair(df,var)

    plt.savefig(o)