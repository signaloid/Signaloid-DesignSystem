export const uxhw_definitions = [
  {
    "returnType": "void",
    "paramList": [
      "float *  destinationArray",
      "void *  samples",
      "size_t sampleCount",
      "size_t sampleCardinality"
    ],
    "prototype": "void UxHwFloatDistFromMultidimensionalSamples(float *  destinationArray, void *  samples, size_t sampleCount, size_t sampleCardinality)",
    "functionName": "UxHwFloatDistFromMultidimensionalSamples",
    "documentation": "Create a multivariate distribution from the two-dimensional `samples` array with declaration `samples[sampleCount][sampleCardinality]`, which contains `sampleCount` `sampleCardinality`-dimensional samples of `float` data type. Variable `destinationArray` points to the resulting multivariate distribution that consists of `sampleCardinality` coordinate distributions.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/multidim-dist-from-samples/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float *  samples",
      "size_t sampleCount"
    ],
    "prototype": "float UxHwFloatDistFromSamples(float *  samples, size_t sampleCount)",
    "functionName": "UxHwFloatDistFromSamples",
    "documentation": "Return a `float` whose value is the mean value of the first `sampleCount` elements of the `samples` array and, where, on architectures that associate distributional information with `float` variables, the `float` value's distributional information in the underlying architecture follows the empirical distribution of the first `sampleCount` elements in the `samples` array.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/dist-from-samples/"
  },
  {
    "returnType": "float",
    "paramList": [
      "WeightedFloatSample *  samples",
      "size_t sampleCount",
      "size_t unweightedSampleCount"
    ],
    "prototype": "float UxHwFloatDistFromWeightedSamples(WeightedFloatSample *  samples, size_t sampleCount, size_t unweightedSampleCount)",
    "functionName": "UxHwFloatDistFromWeightedSamples",
    "documentation": "Return a `float` whose value is the mean value of the first `sampleCount` weighted elements of the `samples` array and, where, on architectures that associate distributional information with `float` variables, the `float` value's distributional information in the underlying architecture follows the empirical distribution of the first `sampleCount` weighted elements in the `samples` array. The `unweightedSampleCount` parameter represents the number of unweighted samples that were used to create the weighted samples.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/dist-from-weighted-samples/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float value",
      "size_t n"
    ],
    "prototype": "float UxHwFloatNthMoment(float value, size_t n)",
    "functionName": "UxHwFloatNthMoment",
    "documentation": "On architectures that associate distributional information with `float` variables, when `n > 1`, return the `n`th centralized moment of the distribution associated with `value`, and when `n == 1`, return the `n`th raw moment (i.e., the mean value) of the distribution associated with `value`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/nth-moment/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float value",
      "size_t n"
    ],
    "prototype": "float UxHwFloatNthMode(float value, size_t n)",
    "functionName": "UxHwFloatNthMode",
    "documentation": "Return the `n`th mode of the distribution associated with `value` on architectures that associate distributional information with `float` variables.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/nth-mode/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float value",
      "float probabilityValue"
    ],
    "prototype": "float UxHwFloatQuantile(float value, float probabilityValue)",
    "functionName": "UxHwFloatQuantile",
    "documentation": "Return the distribution support value `x` for which `P(value < x)` is equal to `probabilityValue` on architectures that associate distributional information with `float` variables.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/quantile/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float value",
      "float cutoff"
    ],
    "prototype": "float UxHwFloatProbabilityGT(float value, float cutoff)",
    "functionName": "UxHwFloatProbabilityGT",
    "documentation": "Return the tail probability beyond `cutoff` of the distribution associated with `value` on architectures that associate distributional information with `float` variables.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/tail-probability/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float value"
    ],
    "prototype": "float UxHwFloatSupportMin(float value)",
    "functionName": "UxHwFloatSupportMin",
    "documentation": "Return the minimum of the support of the distribution associated with `value` on architectures that associate distributional information with `float` variables..",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/support-min/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float value"
    ],
    "prototype": "float UxHwFloatSupportMax(float value)",
    "functionName": "UxHwFloatSupportMax",
    "documentation": "Return the maximum of the support of the distribution associated with `value` on architectures that associate distributional information with `float`variables..",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/support-max/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float value"
    ],
    "prototype": "float UxHwFloatSample(float value)",
    "functionName": "UxHwFloatSample",
    "documentation": "Return a sample from the distribution associated with `value` on architectures that associate distributional information with `float` variables.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/sample/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float value",
      "float *  destSampleArray",
      "size_t numberOfRandomSamples"
    ],
    "prototype": "void UxHwFloatSampleBatch(float value, float *  destSampleArray, size_t numberOfRandomSamples)",
    "functionName": "UxHwFloatSampleBatch",
    "documentation": "Stores in `destSampleArray` array `numberOfRandomSamples` samples from the distribution associated with `value` on architectures that associate distributional information with `float` values.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/batch-sample/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float (*likelihood)(float)",
      "float prior",
      "float evidence"
    ],
    "prototype": "float UxHwFloatBayesLaplace(float (*likelihood)(float), float prior, float evidence)",
    "functionName": "UxHwFloatBayesLaplace",
    "documentation": "Return a `float` whose value is the mean value of the posterior. The distributional information of the posterior is calculated by applying the Bayes-Laplace rule to the distribution associated with the `prior`, given the distribution associated with `evidence` and the function pointer `likelihood`. The function `likelihood` should return a `float` value whose associated distribution is the expected distribution for the evidence given a `float` prior value.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/bayesian-inference/bayes-laplace/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float a",
      "float b",
      "float aScale"
    ],
    "prototype": "float UxHwFloatMixture(float a, float b, float aScale)",
    "functionName": "UxHwFloatMixture",
    "documentation": "The `UxHwFloatMixture` function, on architectures that associate distributional information with floating-point variables, creates a distributional value that follows the mixture distribution generated from the distributional values associated with `a` and `b`, and associates it with its return value. The resulting mixture distribution contains the distribution of `a` with probability `aScale` (a value in [0.0, 1.0]) and the distribution of `b` with probability `1 - aScale`. The return value is equal to the mean value of the resulting mixture distribution.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/mixture/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float alpha",
      "float xMin",
      "float xMax"
    ],
    "prototype": "float UxHwFloatBoundedparetoDist(float alpha, float xMin, float xMax)",
    "functionName": "UxHwFloatBoundedparetoDist",
    "documentation": "Return a `float` whose value is the mean value of the Bounded Pareto distribution with parameters `alpha` (shape parameter), `xMin` (minimum of the distribution support), and `xMax` (maximum of the distribution support) and, where, on architectures that associate distributional information with `float` variables, the `float` value's distributional information in the underlying architecture follows the specified Bounded Pareto distribution with parameters `alpha`, `xMin`, and `xMax`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/bounded-pareto-dist/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float mu"
    ],
    "prototype": "float UxHwFloatExponentialDist(float mu)",
    "functionName": "UxHwFloatExponentialDist",
    "documentation": "Return a `float` whose value is the mean value of the Exponential distribution with parameter `mu` (scale parameter) and, on architectures that associate distributional information with `float` variables, the `float` value's distributional information in the underlying architecture follows the specified Exponential distribution with parameter `mu`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/exponential-dist/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float mu",
      "float sigma"
    ],
    "prototype": "float UxHwFloatGaussDist(float mu, float sigma)",
    "functionName": "UxHwFloatGaussDist",
    "documentation": "Return a `float` whose value is the mean value of a Gaussian distribution with parameters `mu` (mean value) and `sigma` (standard deviation) and, where, on architectures that associate distributional information with `float` variables, the `float` value's distributional information in the underlying architecture follows the specified Gaussian distribution with parameters `mu` and `sigma`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/gauss-dist/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float mu",
      "float beta"
    ],
    "prototype": "float UxHwFloatGumbel1Dist(float mu, float beta)",
    "functionName": "UxHwFloatGumbel1Dist",
    "documentation": "Return a `float` whose value is the mean value of a Gumbel type 1 distribution with parameters `mu` (location parameter) and `beta` (scale parameter) and, where, on architectures that associate distributional information with `float` variables, the `float` value's distributional information in the underlying architecture follows the specified Gumbel type 1 distribution with parameters `mu` and `beta`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/gumbel1-dist/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float mu",
      "float b"
    ],
    "prototype": "float UxHwFloatLaplaceDist(float mu, float b)",
    "functionName": "UxHwFloatLaplaceDist",
    "documentation": "Return a `float` whose value is the mean value of a Laplace distribution with parameters `mu` (location parameter) and `b` (scale parameter) and, where, on architectures that associate distributional information with `float` variables, the `float` value's distributional information in the underlying architecture follows the specified Laplace distribution with parameters `mu` and `b`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/laplace-dist/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float location",
      "float scale"
    ],
    "prototype": "float UxHwFloatLogisticDist(float location, float scale)",
    "functionName": "UxHwFloatLogisticDist",
    "documentation": "Return a `float` whose value is the mean value of a Logistic distribution with parameters `location` and `scale` and, where, on architectures that associate distributional information with `float` variables, the `float` value's distributional information in the underlying architecture follows the specified Logistic distribution with parameters `location` and `scale`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/logistic-dist/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float mu",
      "float sigma"
    ],
    "prototype": "float UxHwFloatLognormalDist(float mu, float sigma)",
    "functionName": "UxHwFloatLognormalDist",
    "documentation": "Return a `float` whose value is the mean value of a Log-normal distribution with parameters `mu` (logarithm of scale parameter) and `sigma` (standard deviation of the underlying normal distribution) and, where, on architectures that associate distributional information with `float` variables, the `float` value's distributional information in the underlying architecture follows the specified Log-normal distribution with parameters `mu` and `sigma`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/lognormal-dist/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float a",
      "float b"
    ],
    "prototype": "float UxHwFloatUniformDist(float a, float b)",
    "functionName": "UxHwFloatUniformDist",
    "documentation": "Return a `float` whose value is the mean value of a Uniform distribution with parameters `a` and `b` and, where, on architectures that associate distributional information with `float` variables, the `float` value's distributional information in the underlying architecture follows the specified Uniform distribution with parameters `a` and `b`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/uniform-dist/"
  },
  {
    "returnType": "float",
    "paramList": [
      "float k",
      "float lambda"
    ],
    "prototype": "float UxHwFloatWeibullDist(float k, float lambda)",
    "functionName": "UxHwFloatWeibullDist",
    "documentation": "Return a `float` whose value is the mean value of a Weibull distribution with parameters `k` (scale parameter) and `lambda` (shape parameter) and, where, on architectures  that associate distributional information with `float` variables,  the `float` value's distributional information in the underlying  architecture follows the specified Weibull distribution with parameters  `k` and `lambda`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/weibull-dist/"
  },
  {
    "returnType": "void",
    "paramList": [
      "double *  destinationArray",
      "void *  samples",
      "size_t sampleCount",
      "size_t sampleCardinality"
    ],
    "prototype": "void UxHwDoubleDistFromMultidimensionalSamples(double *  destinationArray, void *  samples, size_t sampleCount, size_t sampleCardinality)",
    "functionName": "UxHwDoubleDistFromMultidimensionalSamples",
    "documentation": "Create a multivariate distribution from the two-dimensional `samples` array with declaration `samples[sampleCount][sampleCardinality]`, which contains `sampleCount` `sampleCardinality`-dimensional samples of `double` data type. Variable `destinationArray` points to the resulting multivariate distribution that consists of `sampleCardinality` coordinate distributions.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/multidim-dist-from-samples/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double *  samples",
      "size_t sampleCount"
    ],
    "prototype": "double UxHwDoubleDistFromSamples(double *  samples, size_t sampleCount)",
    "functionName": "UxHwDoubleDistFromSamples",
    "documentation": "Return a `double` whose value is the mean value of a distribution of based on `samples` and, where, on architectures that associate distributional information with `double` variables, the `double` value's distributional information in the underlying architecture follows the empirical distribution of the values in `samples`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/dist-from-samples/"
  },
  {
    "returnType": "double",
    "paramList": [
      "WeightedDoubleSample *  samples",
      "size_t sampleCount",
      "size_t unweightedSampleCount"
    ],
    "prototype": "double UxHwDoubleDistFromWeightedSamples(WeightedDoubleSample *  samples, size_t sampleCount, size_t unweightedSampleCount)",
    "functionName": "UxHwDoubleDistFromWeightedSamples",
    "documentation": "Return a `double` whose value is the mean value of the first `sampleCount` weighted elements of the `samples` array and, where, on architectures that associate distributional information with `double` variables, the `double` value's distributional information in the underlying architecture follows the empirical distribution of the first `sampleCount` weighted elements in the `samples` array. The `unweightedSampleCount` parameter represents the number of unweighted samples that were used to create the weighted samples.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/dist-from-weighted-samples/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double value",
      "size_t n"
    ],
    "prototype": "double UxHwDoubleNthMoment(double value, size_t n)",
    "functionName": "UxHwDoubleNthMoment",
    "documentation": "On architectures that associate distributional information with `double` variables, when `n > 1`, return the `n`th centralized moment of the distribution associated with `value`, and when `n == 1`, return the `n`th raw moment (i.e., the mean value) of the distribution associated with `value`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/nth-moment/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double value",
      "size_t n"
    ],
    "prototype": "double UxHwDoubleNthMode(double value, size_t n)",
    "functionName": "UxHwDoubleNthMode",
    "documentation": "Return the `n`th mode of the distribution associated with `value` on architectures that associate distributional information with `double` values.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/nth-mode/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double value",
      "double probabilityValue"
    ],
    "prototype": "double UxHwDoubleQuantile(double value, double probabilityValue)",
    "functionName": "UxHwDoubleQuantile",
    "documentation": "Return the distribution support value `x` for which `P(value < x)` is equal to `probabilityValue`, on architectures that associate distributional information with `double` variables.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/quantile/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double value",
      "double cutoff"
    ],
    "prototype": "double UxHwDoubleProbabilityGT(double value, double cutoff)",
    "functionName": "UxHwDoubleProbabilityGT",
    "documentation": "Return the tail probability beyond `cutoff` of the distribution associated with `value`, on architectures that associate distributional information with `double` values.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/tail-probability/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double value"
    ],
    "prototype": "double UxHwDoubleSupportMin(double value)",
    "functionName": "UxHwDoubleSupportMin",
    "documentation": "Return the minimum of the support of the distribution associated with `value` on architectures that associate distributional information with `double` values.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/support-min/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double value"
    ],
    "prototype": "double UxHwDoubleSupportMax(double value)",
    "functionName": "UxHwDoubleSupportMax",
    "documentation": "Return the maximum of the support of the distribution associated with `value` on architectures that associate distributional information with `double` values.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/support-max/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double value"
    ],
    "prototype": "double UxHwDoubleSample(double value)",
    "functionName": "UxHwDoubleSample",
    "documentation": "Return a sample from the distribution associated with `value` on architectures that associate distributional information with `double` values.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/sample/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double value",
      "double *  destSampleArray",
      "size_t numberOfRandomSamples"
    ],
    "prototype": "void UxHwDoubleSampleBatch(double value, double *  destSampleArray, size_t numberOfRandomSamples)",
    "functionName": "UxHwDoubleSampleBatch",
    "documentation": "Stores `numberOfRandomSamples` samples from the distribution associated with `value` into the `destSampleArray` array. Works on architectures that associate distributional information with `double` values.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/querying-uncertainty/batch-sample/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double (*likelihood)(double)",
      "double prior",
      "double evidence"
    ],
    "prototype": "double UxHwDoubleBayesLaplace(double (*likelihood)(double), double prior, double evidence)",
    "functionName": "UxHwDoubleBayesLaplace",
    "documentation": "Return a `double` whose value is the mean value of the posterior. The distributional information of the posterior is calculated by applying the Bayes-Laplace rule to the distribution associated with the `prior`, given the distribution associated with `evidence` and the function pointer `likelihood`. The function `likelihood` should return a `double` value whose associated distribution is the expected distribution for the evidence given a `double` prior value.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/bayesian-inference/bayes-laplace/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double a",
      "double b",
      "double aScale"
    ],
    "prototype": "double UxHwDoubleMixture(double a, double b, double aScale)",
    "functionName": "UxHwDoubleMixture",
    "documentation": "The `UxHwDoubleMixture` function, on architectures that associate distributional information with floating-point variables, creates a distributional value that follows the mixture distribution generated from the distributional values associated with `a` and `b`, and associates it with its return value. The resulting mixture distribution contains the distribution of `a` with probability `aScale` (a value in [0.0, 1.0]) and the distribution of `b` with probability `1 - aScale`. The return value is equal to the mean value of the resulting mixture distribution.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/mixture/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double alpha",
      "double xMin",
      "double xMax"
    ],
    "prototype": "double UxHwDoubleBoundedparetoDist(double alpha, double xMin, double xMax)",
    "functionName": "UxHwDoubleBoundedparetoDist",
    "documentation": "Return a `double` whose value is the mean value of the Bounded Pareto distribution with parameters `alpha` (shape parameter), `xMin` (minimum of the distribution support), and `xMax` (maximum of the distribution support) and, where, on architectures that associate distributional information with `double` variables, the `double` value's distributional information in the underlying architecture follows the specified Bounded Pareto distribution with parameters `alpha`, `xMin`, and `xMax`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/bounded-pareto-dist/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double mu"
    ],
    "prototype": "double UxHwDoubleExponentialDist(double mu)",
    "functionName": "UxHwDoubleExponentialDist",
    "documentation": "Return a `double` whose value is the mean value of the Exponential distribution with parameter `mu` (scale parameter) and, where, on architectures that associate distributional information with `double` variables, the `double` value's distributional information in the underlying architecture follows the specified Exponential distribution with parameter `mu`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/exponential-dist/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double mu",
      "double sigma"
    ],
    "prototype": "double UxHwDoubleGaussDist(double mu, double sigma)",
    "functionName": "UxHwDoubleGaussDist",
    "documentation": "Return a `double` whose value is the mean value of a Gaussian distribution with parameters `mu` (mean value) and `sigma` (standard deviation) and, where, on architectures that associate distributional information with `double` variables, the `double` value's distributional information in the underlying architecture follows the specified Gaussian distribution with parameters `mu` and `sigma`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/gauss-dist/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double mu",
      "double beta"
    ],
    "prototype": "double UxHwDoubleGumbel1Dist(double mu, double beta)",
    "functionName": "UxHwDoubleGumbel1Dist",
    "documentation": "Return a `double` whose value is the mean of a Gumbel type 1 distribution with parameters `mu` (location parameter) and `beta` (scale parameter) and, where, on architectures that associate distributional information with `double` variables, the `double` value's distributional information in the underlying architecture follows the specified Gumbel type 1 distribution with parameters `mu` and `beta`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/gumbel1-dist/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double mu",
      "double b"
    ],
    "prototype": "double UxHwDoubleLaplaceDist(double mu, double b)",
    "functionName": "UxHwDoubleLaplaceDist",
    "documentation": "Return a `double` whose value is the mean of a Laplace distribution with parameters `mu` (location parameter) and `b` (scale parameter) and, where, on architectures that associate distributional information with `double` variables, the `double` value's distributional information in the underlying architecture follows the specified Laplace distribution with parameters `mu` and `b`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/laplace-dist/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double location",
      "double scale"
    ],
    "prototype": "double UxHwDoubleLogisticDist(double location, double scale)",
    "functionName": "UxHwDoubleLogisticDist",
    "documentation": "Return a `double` whose value is the mean of a Logistic distribution with parameters `location` and `scale` and, where, on architectures that associate distributional information with `double` variables, the `double` value's distributional information in the underlying architecture follows the specified Logistic distribution with parameters `location` and `scale`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/logistic-dist/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double mu",
      "double sigma"
    ],
    "prototype": "double UxHwDoubleLognormalDist(double mu, double sigma)",
    "functionName": "UxHwDoubleLognormalDist",
    "documentation": "Return a `double` whose value is the mean value of a Log-normal distribution with parameters `mu` (logarithm of scale parameter) and `sigma` (standard deviation of the underlying normal distribution) and, where, on architectures that associate distributional information with `double` variables, the `double` value's distributional information in the underlying architecture follows the specified Log-normal distribution with parameters `mu` and `sigma`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/lognormal-dist/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double a",
      "double b"
    ],
    "prototype": "double UxHwDoubleUniformDist(double a, double b)",
    "functionName": "UxHwDoubleUniformDist",
    "documentation": "Return a `double` whose value is the mean value of a Uniform distribution with parameters `a` and `b` and, where, on architectures that associate distributional information with `double` variables, the `double` value's distributional information in the underlying architecture follows the specified Uniform distribution with parameters `a` and `b`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/uniform-dist/"
  },
  {
    "returnType": "double",
    "paramList": [
      "double k",
      "double lambda"
    ],
    "prototype": "double UxHwDoubleWeibullDist(double k, double lambda)",
    "functionName": "UxHwDoubleWeibullDist",
    "documentation": "Return a `double` whose value is the mean value of a Weibull distribution with parameters `k` (scale parameter) and `lambda` (shape parameter) and, where, on architectures that associate distributional information with `double` variables, the `double` value's distributional information in the underlying architecture follows the specified Weibull distribution with parameters `k` and `lambda`.",
    "documentationUrl": "https://docs.signaloid.io/docs/hardware-api/inserting-uncertainty/parametric-distributions/weibull-dist/"
  }
]
