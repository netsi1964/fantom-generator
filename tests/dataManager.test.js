import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dataManager, defaultState } from '../js/dataManager.js';

describe('dataManager', () => {
  beforeEach(() => {
    // Reset dataManager to default state and clear subscribers before each test
    dataManager.setState(JSON.parse(JSON.stringify(defaultState)), false);
    // This is a bit of a hack to clear subscribers without exporting the array
    const originalSubscribe = dataManager.subscribe;
    dataManager.subscribers = [];
    dataManager.subscribe = function(callback) {
        this.subscribers.push(callback);
        // We don't need the unsubscribe function in tests
        return () => {}; 
    };
  });

  it('should return the default state initially', () => {
    expect(dataManager.getState()).toEqual(defaultState);
  });

  it('should update state with setState', () => {
    const newState = { ...defaultState, caseId: 'CASE-002' };
    dataManager.setState(newState);
    expect(dataManager.getState().caseId).toBe('CASE-002');
  });

  it('should notify subscribers on state change', () => {
    const listener = vi.fn();
    dataManager.subscribe(listener);

    const newState = { ...defaultState, caseId: 'CASE-003' };
    dataManager.setState(newState);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(newState);
  });

  it('should NOT notify subscribers if notify is false', () => {
    const listener = vi.fn();
    dataManager.subscribe(listener);

    const newState = { ...defaultState, caseId: 'CASE-004' };
    dataManager.setState(newState, false);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should reset only parameters to their default values', () => {
    // First, change some parameters and a non-parameter value
    const modifiedState = {
      ...dataManager.getState(),
      caseId: 'SHOULD-NOT-RESET',
      parameters: {
        ...dataManager.getState().parameters,
        age: 50,
      }
    };
    dataManager.setState(modifiedState);

    expect(dataManager.getState().caseId).toBe('SHOULD-NOT-RESET');
    expect(dataManager.getState().parameters.age).toBe(50);
    
    dataManager.resetParameters();

    const stateAfterReset = dataManager.getState();
    expect(stateAfterReset.caseId).toBe('SHOULD-NOT-RESET'); // Should not change
    expect(stateAfterReset.parameters.age).toBe(defaultState.parameters.age); // Should reset
    expect(stateAfterReset.parameters).toEqual(defaultState.parameters);
  });

  it('should save a new parameter set', () => {
    const newSet = { name: 'Test Set', parameters: { age: 45, weight: 180 } };
    dataManager.saveParameterSet(newSet);
    
    const state = dataManager.getState();
    expect(state.savedParameterSets.some(set => set.name === 'Test Set')).toBe(true);
    const savedSet = state.savedParameterSets.find(set => set.name === 'Test Set');
    expect(savedSet.parameters).toEqual(newSet.parameters);
  });

  it('should update an existing parameter set if name matches', () => {
    const initialSet = { name: 'Existing Set', parameters: { age: 30 } };
    dataManager.saveParameterSet(initialSet);

    const updatedSet = { name: 'Existing Set', parameters: { age: 35 } };
    dataManager.saveParameterSet(updatedSet);

    const state = dataManager.getState();
    const sets = state.savedParameterSets.filter(set => set.name === 'Existing Set');
    expect(sets.length).toBe(1);
    expect(sets[0].parameters.age).toBe(35);
  });

  it('should delete a parameter set', () => {
    const setToDelete = { name: 'Delete Me', parameters: { age: 99 } };
    dataManager.saveParameterSet(setToDelete);
    
    let state = dataManager.getState();
    expect(state.savedParameterSets.some(set => set.name === 'Delete Me')).toBe(true);

    dataManager.deleteParameterSet('Delete Me');
    
    state = dataManager.getState();
    expect(state.savedParameterSets.some(set => set.name === 'Delete Me')).toBe(false);
  });
}); 