import numpy as np
import matplotlib.pyplot as plt



h = plt.hist(np.random.triangular(-2, 0, 2, 100000), bins=200,
             density=True,color='green')
plt.show()