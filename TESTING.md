# KaloWrite API Testing Guide

This document provides comprehensive testing instructions for the KaloWrite humanization API.

## 🚀 Quick Start

1. **Start the Backend Server:**
   ```bash
   cd kalo-write-backend
   npm run start:dev
   ```

2. **Start the Frontend Server:**
   ```bash
   cd kalo-write
   npm run dev
   ```

3. **Access Test Pages:**
   - Main App: http://localhost:3000
   - Humanization Test: http://localhost:3000/test-humanize
   - API Test Suite: http://localhost:3000/api-test

## 🧪 Test Pages Overview

### 1. Main App (`/`)
- **Purpose**: Production-ready humanization interface
- **Features**: 
  - User authentication (login/register)
  - Text humanization with OpenAI
  - Humanization history
  - Word count tracking
  - Subscription management

### 2. Humanization Test (`/test-humanize`)
- **Purpose**: Comprehensive testing of the humanization API
- **Features**:
  - Automated test suite (connection, registration, humanization)
  - Sample test texts
  - Real-time test results
  - Response time tracking
  - Side-by-side comparison of original vs humanized text

### 3. API Test Suite (`/api-test`)
- **Purpose**: Low-level API testing and debugging
- **Features**:
  - Predefined GraphQL queries
  - Custom query execution
  - Individual endpoint testing
  - Response inspection
  - Error debugging

## 🔧 API Endpoints

### Backend Endpoints
- **GraphQL**: http://localhost:3001/graphql
- **GraphQL Playground**: http://localhost:3001/graphql
- **API Documentation**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

### Key GraphQL Operations

#### 1. User Registration
```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    access_token
    user {
      id
      email
      name
      subscription {
        id
        plan
        status
        wordLimit
        usedWords
      }
    }
  }
}
```

#### 2. User Login
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    access_token
    user {
      id
      email
      name
      subscription {
        id
        plan
        status
        wordLimit
        usedWords
      }
    }
  }
}
```

#### 3. Text Humanization
```graphql
mutation HumanizeText($input: HumanizeTextInput!) {
  humanizeText(input: $input) {
    id
    originalText
    humanizedText
    wordCount
    createdAt
  }
}
```

#### 4. Get User Humanizations
```graphql
query GetUserHumanizations($limit: Int, $offset: Int) {
  getUserHumanizations(limit: $limit, offset: $offset) {
    id
    originalText
    humanizedText
    wordCount
    createdAt
  }
}
```

## 🧪 Testing Workflow

### 1. Backend Connection Test
- Verifies GraphQL endpoint is accessible
- Tests schema introspection
- Measures response time

### 2. Authentication Test
- Tests user registration
- Tests user login
- Verifies JWT token generation

### 3. Humanization Test
- Tests text humanization with OpenAI
- Verifies response format
- Tests error handling
- Measures processing time

### 4. Integration Test
- End-to-end workflow testing
- User registration → Login → Humanization
- Verifies complete functionality

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch" Error**
   - Check if backend server is running on port 3001
   - Verify CORS configuration
   - Check network connectivity

2. **Authentication Errors**
   - Ensure user is registered
   - Check JWT token validity
   - Verify Authorization header format

3. **Humanization Errors**
   - Check OpenAI API key configuration
   - Verify subscription limits
   - Check text length limits

4. **Database Errors**
   - Ensure PostgreSQL is running
   - Check database connection string
   - Run database migrations

### Debug Steps

1. **Check Backend Logs**
   ```bash
   cd kalo-write-backend
   npm run start:dev
   ```

2. **Check Database Connection**
   ```bash
   cd kalo-write-backend
   npm run db:push
   ```

3. **Test GraphQL Playground**
   - Open http://localhost:3001/graphql
   - Run introspection query
   - Test individual operations

4. **Check Environment Variables**
   - Verify `.env` file in backend
   - Check OpenAI API key
   - Verify database URL

## 📊 Test Data

### Sample Texts for Testing

1. **AI-Generated Text:**
   ```
   I'm sorry, but I can't help you find free/full copies of copyrighted books unless they're legally released by the author or publisher.

   However, I can help you find legal free/open-access resources that cover the same topics. Here are some good ones:
   ```

2. **Business Text:**
   ```
   The implementation of artificial intelligence in modern business operations has revolutionized the way organizations approach data analysis and decision-making processes. This technological advancement enables companies to leverage machine learning algorithms for predictive analytics.
   ```

3. **Academic Text:**
   ```
   In today's fast-paced digital landscape, it is important to note that businesses must adapt to changing consumer behaviors and market dynamics. Studies have shown that companies that embrace digital transformation are more likely to succeed in the long term.
   ```

## 🔍 Monitoring

### Key Metrics to Monitor
- Response times for each operation
- Success/failure rates
- Error types and frequencies
- User registration/login rates
- Humanization request volumes

### Performance Benchmarks
- **Connection Test**: < 100ms
- **Registration**: < 500ms
- **Login**: < 300ms
- **Humanization**: < 5s (depends on text length)

## 📝 Test Reports

After running tests, you can:
1. Copy test results to clipboard
2. Save response data for analysis
3. Export test results for documentation
4. Share test results with team

## 🚀 Production Deployment

Before deploying to production:
1. Run all test suites
2. Verify all endpoints work correctly
3. Test with production data
4. Check error handling
5. Verify security measures
6. Test performance under load

---

For more information, visit the [main documentation](../README.md) or contact the development team.
