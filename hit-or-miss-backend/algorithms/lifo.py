def simulate(ref, frames):
    mem = []
    faults = 0
    hits = 0
    steps = []

    for page in ref:
        if page in mem:
            hits += 1
        else:
            faults += 1
            if len(mem) < frames:
                mem.append(page)
            else:
                mem.pop()
                mem.append(page)
        steps.append(mem.copy())
    return hits, faults, steps