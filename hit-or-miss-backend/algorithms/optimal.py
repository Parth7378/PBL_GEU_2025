def simulate(ref, frames):
    mem = []
    faults = 0
    hits = 0
    steps = []

    for i in range(len(ref)):
        page = ref[i]
        if page in mem:
            hits += 1
        else:
            faults += 1
            if len(mem) < frames:
                mem.append(page)
            else:
                future = ref[i+1:]
                idxs = [(future.index(p) if p in future else float('inf')) for p in mem]
                mem[idxs.index(max(idxs))] = page
        steps.append(mem.copy())
    return hits, faults, steps