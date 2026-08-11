import { Injectable, BadRequestException } from '@nestjs/common';

export interface ProviderKeyPool {
  provider: string;
  rawKeysString: string;
  keys: {
    key: string;
    maskedKey: string;
    status: 'ACTIVE' | 'RATE_LIMITED' | 'EXHAUSTED';
    requestsRoutedCount: number;
    rateLimitCount: number;
    lastUsedAt?: string;
  }[];
  currentRotationIndex: number;
}

export interface AiRouterConfigDto {
  strategy: 'ROUND_ROBIN' | 'PRIORITY_FAILOVER';
  providerPriorities: string[];
  groqKeys?: string;
  geminiKeys?: string;
  openAiKeys?: string;
  anthropicKeys?: string;
  mistralKeys?: string;
}

@Injectable()
export class AiRouterService {
  private strategy: 'ROUND_ROBIN' | 'PRIORITY_FAILOVER' = 'ROUND_ROBIN';
  private providerPriorities: string[] = ['GROQ', 'GEMINI', 'OPENAI', 'ANTHROPIC', 'MISTRAL'];

  private keyPools: Record<string, ProviderKeyPool> = {
    GROQ: {
      provider: 'GROQ',
      rawKeysString: 'gsk_free_key_alpha_101, gsk_free_key_beta_102',
      keys: [
        { key: 'gsk_free_key_alpha_101', maskedKey: 'gsk_free_..._101', status: 'ACTIVE', requestsRoutedCount: 142, rateLimitCount: 0 },
        { key: 'gsk_free_key_beta_102', maskedKey: 'gsk_free_..._102', status: 'ACTIVE', requestsRoutedCount: 98, rateLimitCount: 0 },
      ],
      currentRotationIndex: 0,
    },
    GEMINI: {
      provider: 'GEMINI',
      rawKeysString: 'AIzaSy_gemini_key_1, AIzaSy_gemini_key_2',
      keys: [
        { key: 'AIzaSy_gemini_key_1', maskedKey: 'AIzaSy_..._key_1', status: 'ACTIVE', requestsRoutedCount: 210, rateLimitCount: 0 },
        { key: 'AIzaSy_gemini_key_2', maskedKey: 'AIzaSy_..._key_2', status: 'ACTIVE', requestsRoutedCount: 185, rateLimitCount: 0 },
      ],
      currentRotationIndex: 0,
    },
    OPENAI: {
      provider: 'OPENAI',
      rawKeysString: 'sk-proj-openai-key-primary',
      keys: [
        { key: 'sk-proj-openai-key-primary', maskedKey: 'sk-proj-o..._primary', status: 'ACTIVE', requestsRoutedCount: 64, rateLimitCount: 0 },
      ],
      currentRotationIndex: 0,
    },
    ANTHROPIC: {
      provider: 'ANTHROPIC',
      rawKeysString: 'sk-ant-anthropic-key-primary',
      keys: [
        { key: 'sk-ant-anthropic-key-primary', maskedKey: 'sk-ant-a..._primary', status: 'ACTIVE', requestsRoutedCount: 42, rateLimitCount: 0 },
      ],
      currentRotationIndex: 0,
    },
    MISTRAL: {
      provider: 'MISTRAL',
      rawKeysString: 'mistral_free_key_101',
      keys: [
        { key: 'mistral_free_key_101', maskedKey: 'mistral_..._101', status: 'ACTIVE', requestsRoutedCount: 19, rateLimitCount: 0 },
      ],
      currentRotationIndex: 0,
    },
  };

  private parseKeysString(keysString: string) {
    if (!keysString) return [];
    return keysString
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
      .map((key) => ({
        key,
        maskedKey: key.length > 10 ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : '****',
        status: 'ACTIVE' as const,
        requestsRoutedCount: 0,
        rateLimitCount: 0,
      }));
  }

  updateConfig(dto: AiRouterConfigDto) {
    if (dto.strategy) this.strategy = dto.strategy;
    if (dto.providerPriorities) this.providerPriorities = dto.providerPriorities;

    if (dto.groqKeys !== undefined) {
      this.keyPools.GROQ.rawKeysString = dto.groqKeys;
      this.keyPools.GROQ.keys = this.parseKeysString(dto.groqKeys);
      this.keyPools.GROQ.currentRotationIndex = 0;
    }
    if (dto.geminiKeys !== undefined) {
      this.keyPools.GEMINI.rawKeysString = dto.geminiKeys;
      this.keyPools.GEMINI.keys = this.parseKeysString(dto.geminiKeys);
      this.keyPools.GEMINI.currentRotationIndex = 0;
    }
    if (dto.openAiKeys !== undefined) {
      this.keyPools.OPENAI.rawKeysString = dto.openAiKeys;
      this.keyPools.OPENAI.keys = this.parseKeysString(dto.openAiKeys);
      this.keyPools.OPENAI.currentRotationIndex = 0;
    }
    if (dto.anthropicKeys !== undefined) {
      this.keyPools.ANTHROPIC.rawKeysString = dto.anthropicKeys;
      this.keyPools.ANTHROPIC.keys = this.parseKeysString(dto.anthropicKeys);
      this.keyPools.ANTHROPIC.currentRotationIndex = 0;
    }
    if (dto.mistralKeys !== undefined) {
      this.keyPools.MISTRAL.rawKeysString = dto.mistralKeys;
      this.keyPools.MISTRAL.keys = this.parseKeysString(dto.mistralKeys);
      this.keyPools.MISTRAL.currentRotationIndex = 0;
    }

    return this.getConfig();
  }

  getConfig() {
    return {
      strategy: this.strategy,
      providerPriorities: this.providerPriorities,
      keyPools: Object.values(this.keyPools).map((pool) => ({
        provider: pool.provider,
        rawKeysString: pool.rawKeysString,
        totalKeysCount: pool.keys.length,
        activeKeysCount: pool.keys.filter((k) => k.status === 'ACTIVE').length,
        keys: pool.keys,
        currentRotationIndex: pool.currentRotationIndex,
      })),
      updatedAt: new Date().toISOString(),
    };
  }

  routeRequest(requestedProvider?: string) {
    const targetProvider = requestedProvider || this.providerPriorities[0] || 'GROQ';
    const pool = this.keyPools[targetProvider] || this.keyPools.GROQ;

    if (!pool || pool.keys.length === 0) {
      // Fallback to next available provider in priorities
      const fallbackProvider = this.providerPriorities.find((p) => this.keyPools[p]?.keys.length > 0) || 'GEMINI';
      const fallbackPool = this.keyPools[fallbackProvider];
      return this.selectKeyFromPool(fallbackPool);
    }

    return this.selectKeyFromPool(pool);
  }

  private selectKeyFromPool(pool: ProviderKeyPool) {
    const activeKeys = pool.keys.filter((k) => k.status === 'ACTIVE');
    if (activeKeys.length === 0) {
      // Auto reset rate limits if all keys rate limited
      pool.keys.forEach((k) => (k.status = 'ACTIVE'));
    }

    let selectedKeyObj;
    if (this.strategy === 'ROUND_ROBIN') {
      const idx = pool.currentRotationIndex % pool.keys.length;
      selectedKeyObj = pool.keys[idx];
      pool.currentRotationIndex = (pool.currentRotationIndex + 1) % pool.keys.length;
    } else {
      // PRIORITY_FAILOVER: always use first active key
      selectedKeyObj = pool.keys.find((k) => k.status === 'ACTIVE') || pool.keys[0];
    }

    selectedKeyObj.requestsRoutedCount++;
    selectedKeyObj.lastUsedAt = new Date().toISOString();

    return {
      provider: pool.provider,
      selectedKey: selectedKeyObj.key,
      maskedKey: selectedKeyObj.maskedKey,
      strategyUsed: this.strategy,
      keyIndex: pool.keys.indexOf(selectedKeyObj) + 1,
      totalKeysInPool: pool.keys.length,
    };
  }

  simulateRotation(provider: string) {
    const result = this.routeRequest(provider);
    return {
      simulationStatus: 'SUCCESS',
      requestedProvider: provider,
      servedProvider: result.provider,
      keyUsed: result.maskedKey,
      keyPosition: `Key ${result.keyIndex} of ${result.totalKeysInPool}`,
      strategy: result.strategyUsed,
      timestamp: new Date().toISOString(),
    };
  }

  simulateRateLimitFailover(provider: string, keyIndexToFail: number) {
    const pool = this.keyPools[provider] || this.keyPools.GROQ;
    if (pool.keys[keyIndexToFail]) {
      pool.keys[keyIndexToFail].status = 'RATE_LIMITED';
      pool.keys[keyIndexToFail].rateLimitCount++;
    }

    // Failover request
    const failoverResult = this.routeRequest(provider);
    return {
      event: 'RATE_LIMIT_TRIGGERED_AUTOMATIC_FAILOVER',
      rateLimitedKeyIndex: keyIndexToFail + 1,
      failoverServedProvider: failoverResult.provider,
      failoverServedKey: failoverResult.maskedKey,
      status: 'SUCCESSFULLY_FAILED_OVER_WITHOUT_DROPPING_REQUEST',
      timestamp: new Date().toISOString(),
    };
  }
}
