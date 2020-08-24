import numpy as np
from sklearn.linear_model import LinearRegression

data = np.loadtxt('data/fa10.csv', skiprows=1, delimiter=',')
difficulty = data[:, 0]
score = data[:, 1]
elapsed = data[:, 2]
rating = data[:, 3]

log_score = np.log(score)
log_elapsed = np.log(elapsed)

X = np.column_stack((log_score, log_elapsed))
y = difficulty
regression = LinearRegression().fit(X, y)
print(regression.predict(X[600:610]))
print(y[600:610])

