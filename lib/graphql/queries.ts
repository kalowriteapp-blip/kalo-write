import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      access_token
      user {
        id
        email
        name
        avatar
        subscription {
          id
          plan
          status
          usedWords
          wordLimit
          currentPeriodStart
          currentPeriodEnd
        }
        humanizations {
          id
          originalText
          humanizedText
          wordCount
          createdAt
        }
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $name: String!) {
    register(registerInput: { email: $email, password: $password, name: $name }) {
      access_token
      user {
        id
        email
        name
        avatar
        subscription {
          id
          plan
          status
          usedWords
          wordLimit
          currentPeriodStart
          currentPeriodEnd
        }
        humanizations {
          id
          originalText
          humanizedText
          wordCount
          createdAt
        }
      }
    }
  }
`;

export const HUMANIZE_TEXT_MUTATION = gql`
  mutation HumanizeText($input: HumanizeTextInput!) {
    humanizeText(input: $input) {
      id
      originalText
      humanizedText
      wordCount
      createdAt
    }
  }
`;

export const GET_USER_QUERY = gql`
  query GetUser {
    me {
      id
      email
      name
      avatar
      subscription {
        id
        plan
        status
        usedWords
        wordLimit
        currentPeriodStart
        currentPeriodEnd
      }
      humanizations {
        id
        originalText
        humanizedText
        wordCount
        createdAt
      }
    }
  }
`;

export const GET_REMAINING_WORDS_QUERY = gql`
  query GetRemainingWords {
    getRemainingWords
  }
`;

export const GET_USER_HUMANIZATIONS_QUERY = gql`
  query GetUserHumanizations($limit: Int, $offset: Int) {
    getUserHumanizations(limit: $limit, offset: $offset) {
      id
      originalText
      humanizedText
      wordCount
      createdAt
    }
  }
`;

export const GET_HUMANIZATION_QUERY = gql`
  query GetHumanization($id: ID!) {
    getHumanization(id: $id) {
      id
      originalText
      humanizedText
      wordCount
      createdAt
    }
  }
`;

export const DELETE_HUMANIZATION_MUTATION = gql`
  mutation DeleteHumanization($id: ID!) {
    deleteHumanization(id: $id)
  }
`;
