from config import settings

def get_all_configs() -> dict:
    return settings.dict()

if __name__ == "__main__":
    configs = get_all_configs()
    print("Current Settings:\n")
    for key, value in configs.items():
        print(f"{key}: {value}")
