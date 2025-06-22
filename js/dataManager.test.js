import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as dataManager from './dataManager.js';

describe('dataManager', () => {
  beforeEach(() => {
    // Reset localStorage and modules before each test
    localStorage.clear();
    vi.resetModules(); 
  });

  it('should initialize with default state if localStorage is empty', async () => {
    const { initializeAppState, getAppState } = await import('./dataManager.js');
    initializeAppState();
    const state = getAppState();
    expect(state.parameters).toHaveLength(9);
    expect(state.caseInfo.title).toBe('');
  });

  it('should load state from localStorage if it exists', async () => {
    const mockState = {
      caseInfo: { title: 'Test Case' },
      parameters: [{ id: 'test-param', name: 'Test Param', shades: ['A'], value: 'A' }],
      renderStyle: 'Realistic',
      freeText: 'Test text',
    };
    localStorage.setItem('fantomAppState', JSON.stringify(mockState));
    
    const { initializeAppState, getAppState } = await import('./dataManager.js');
    initializeAppState();
    const state = getAppState();

    expect(state.caseInfo.title).toBe('Test Case');
    expect(state.parameters[0].name).toBe('Test Param');
    expect(state.renderStyle).toBe('Realistic');
  });

  it('should save and retrieve parameters', async () => {
    const { saveParameters, getParameters } = await import('./dataManager.js');
    const newParams = [{ id: 'new-param', name: 'New', shades: ['B'], value: 'B' }];
    saveParameters(newParams);
    const params = getParameters();
    expect(params).toEqual(newParams);
  });

  it('should reset only parameters to default', async () => {
    const { saveCaseInfo, getCaseInfo, getParameters, resetParameters } = await import('./dataManager.js');
    const { defaultState } = await import('./dataManager.js');
    
    // Modify state
    saveCaseInfo({ title: 'A case to remember' });
    const modifiedParams = getParameters();
    modifiedParams.push({ id: 'custom' });
    
    resetParameters();

    const params = getParameters();
    const caseInfo = getCaseInfo();

    expect(params).toEqual(defaultState.parameters);
    expect(caseInfo.title).toBe('A case to remember'); // Should not be reset
  });
  
  it('should reset the entire app state', async () => {
    const { saveCaseInfo, getCaseInfo, getParameters, resetAppState } = await import('./dataManager.js');
    const { defaultState } = await import('./dataManager.js');
    
    // Modify state
    saveCaseInfo({ title: 'A case to forget' });
    const modifiedParams = getParameters();
    modifiedParams.push({ id: 'custom' });

    resetAppState();

    const state = (await import('./dataManager.js')).getAppState();

    expect(state.parameters).toEqual(defaultState.parameters);
    expect(state.caseInfo.title).toBe(''); // Should be reset
  });
}); 