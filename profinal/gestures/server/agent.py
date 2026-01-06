# server/agent.py
import json
from pathlib import Path
import numpy as np
import time

class BanditAgent:
    def __init__(self, actions, storage_file=None, eps=0.3, min_eps=0.1, decay=0.999):
        self.actions = {a['id']: a for a in actions}
        self.ids = list(self.actions.keys())
        self.storage_file = Path(storage_file) if storage_file else Path(__file__).parent / "agent_weights.json"
        self.eps = eps
        self.min_eps = min_eps
        self.decay = decay
        self._load()

    def _load(self):
        if self.storage_file.exists():
            try:
                data = json.loads(self.storage_file.read_text())
                self.counts = {k: data.get("counts", {}).get(k, 0) for k in self.ids}
                self.values = {k: data.get("values", {}).get(k, 1.0) for k in self.ids}
                self.eps = data.get("eps", self.eps)
                print(f"🔍 Loaded agent state: {self.get_state()}")
            except:
                print("❌ Failed to load agent, initializing fresh...")
                self._init()
        else:
            print("🆕 No saved agent found, initializing fresh...")
            self._init()
            self._save()

    def _init(self):
        self.counts = {k: 0 for k in self.ids}
        self.values = {k: 1.0 for k in self.ids}  # All actions start equal

    def _save(self):
        payload = {
            "counts": self.counts,
            "values": self.values,
            "eps": self.eps
        }
        self.storage_file.write_text(json.dumps(payload))
        print(f"💾 Saved agent state: {payload}")

    def choose(self):
        # epsilon-greedy exploration
        if np.random.rand() < self.eps:
            chosen = np.random.choice(self.ids)
            print(f"🎲 Exploring: {chosen}")
            return self.actions[chosen]

        vals = np.array([self.values[k] for k in self.ids])
        maxv = vals.max()
        best = [self.ids[i] for i, v in enumerate(vals) if v == maxv]
        chosen = np.random.choice(best)
        print(f"🎯 Exploiting: {chosen} (values: {dict(zip(self.ids, vals))})")
        return self.actions[chosen]

    def update(self, aid, reward):
        self.counts[aid] += 1
        n = self.counts[aid]
        prev = self.values[aid]

        # Incremental mean update
        self.values[aid] = prev + (reward - prev) / n

        # decay epsilon
        self.eps = max(self.min_eps, self.eps * self.decay)

        print(f"📈 Updated {aid}: count={n}, value={self.values[aid]:.2f}, eps={self.eps:.3f}")
        self._save()

    def get_state(self):
        return {
            "counts": self.counts,
            "values": self.values,
            "eps": self.eps
        }