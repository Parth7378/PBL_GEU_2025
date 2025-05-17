from collections import defaultdict

def simulate(ref, frames):
    mem = []
    hits = 0
    faults = 0
    steps = []
    future = defaultdict(list)

    for i, page in enumerate(ref):
        future[page].append(i)

    for i, page in enumerate(ref):
        if page in mem:
            hits += 1
        else:
            faults += 1
            if len(mem) < frames:
                mem.append(page)
            else:
                future_indices = {p: next((x for x in future[p] if x > i), float('inf')) for p in mem}
                farthest_page = max(future_indices, key=future_indices.get)
                mem[mem.index(farthest_page)] = page
        steps.append(mem.copy())
    return hits, faults, steps