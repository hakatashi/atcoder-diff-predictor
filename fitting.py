import math
import random
import numpy as np

# https://github.com/kenkoooo/AtCoderProblems/blob/a56cb972c8ab9bc1cfadcdb0e591bb1252b872b2/lambda-functions/time-estimator/function.py#L71
def fit_2plm_irt(xs, ys):
  def safe_log(x):
    return math.log(max(x, 10 ** -100))

  def safe_sigmoid(x):
    return 1. / (1. + math.exp(min(-x, 750)))

  random.seed(20191019)

  iter_n = max(100000 // len(xs), 1)

  eta = 1.
  x_scale = 1000.

  scxs = [x / x_scale for x in xs]
  samples = list(zip(scxs, ys))

  a, b = 0., 0.
  r_a, r_b = 1., 1.
  iterations = []
  for iteration in range(iter_n):
    logl = 0.
    for x, y in samples:
      p = safe_sigmoid(a * x + b)
      logl += safe_log(p if y == 1. else (1 - p))
    iterations.append((logl, a, b))

    random.shuffle(samples)
    for x, y in samples:
      p = safe_sigmoid(a * x + b)
      grad_a = x * (y - p)
      grad_b = (y - p)
      r_a += grad_a ** 2
      r_b += grad_b ** 2
      a += eta * grad_a / r_a ** 0.5
      b += eta * grad_b / r_b ** 0.5
  best_logl, a, b = max(iterations)
  a /= x_scale
  return -b / a, a

data = np.loadtxt('data/abc155_f.csv', delimiter=',')

ratings = data[:, 0]
acs = data[:, 1]

print(fit_2plm_irt(ratings, acs))
