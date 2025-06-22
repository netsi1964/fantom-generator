import { describe, it, expect, vi } from 'vitest';

// Mock the dependencies
vi.mock('./dataManager.js', () => ({
  getAppState: vi.fn(),
}));
vi.mock('./languageManager.js', () => ({
  t: (key, options) => options?.defaultValue || key, // Simple pass-through mock
  getCurrentLanguage: () => 'en',
}));

import { generatePrompt } from './promptGenerator.js';
import * as dataManager from './dataManager.js';

describe('promptGenerator', () => {

  it('should generate a basic prompt with default parameters', () => {
    // Arrange
    const mockState = {
      caseInfo: {},
      parameters: [
        { name: 'Hair Color', value: 'Brown' },
        { name: 'Eye Color', value: 'Blue' },
      ],
      freeText: '',
      renderStyle: 'Sketch',
    };
    dataManager.getAppState.mockReturnValue(mockState);

    // Act
    const prompt = generatePrompt();

    // Assert
    expect(prompt).toBe('A detailed black and white pencil sketch, with clean lines and realistic shading, Hair Color: Brown, Eye Color: Blue.');
  });

  it('should include free text in the prompt', () => {
    // Arrange
    const mockState = {
      caseInfo: {},
      parameters: [{ name: 'Face Shape', value: 'Round' }],
      freeText: 'wearing glasses',
      renderStyle: 'Realistic',
    };
    dataManager.getAppState.mockReturnValue(mockState);

    // Act
    const prompt = generatePrompt();

    // Assert
    expect(prompt).toContain('wearing glasses');
    expect(prompt).toContain('Face Shape: Round');
  });

  it('should handle different render styles', () => {
    // Arrange
    const mockState = {
      caseInfo: {},
      parameters: [],
      freeText: '',
      renderStyle: 'Cartoon',
    };
    dataManager.getAppState.mockReturnValue(mockState);

    // Act
    const prompt = generatePrompt();

    // Assert
    expect(prompt).toContain('A vibrant cartoon illustration, with bold outlines and flat colors');
  });
  
  it('should include case information when available', () => {
    // Arrange
    const mockState = {
      caseInfo: {
        title: 'The informant',
        caseNumber: 'C-123',
        date: '2024-01-01',
      },
      parameters: [],
      freeText: '',
      renderStyle: 'Sketch',
    };
    dataManager.getAppState.mockReturnValue(mockState);

    // Act
    const prompt = generatePrompt();

    // Assert
    expect(prompt).toContain('--- Case Information ---');
    expect(prompt).toContain('Title: The informant');
    expect(prompt).toContain('Case/Journal #: C-123');
    expect(prompt).toContain('Date: 2024-01-01');
  });

  it('should generate an empty prompt string correctly', () => {
    // Arrange
    const mockState = {
      caseInfo: {},
      parameters: [],
      freeText: '',
      renderStyle: 'Painting',
    };
    dataManager.getAppState.mockReturnValue(mockState);
    
    // Act
    const prompt = generatePrompt();
    
    // Assert
    expect(prompt).toBe('A rich and detailed oil painting, with visible brushstrokes and a classic feel.');
  });
}); 